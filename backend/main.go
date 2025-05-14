package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

// ScanResult represents the response from VirusTotal
type ScanResult struct {
	URL     string `json:"url"`
	Status  string `json:"status"`
	Details struct {
		TotalScans    int `json:"total_scans"`
		PositiveScans int `json:"positive_scans"`
	} `json:"details"`
	Error string `json:"error,omitempty"`
}

// PasswordCheckResult represents the response for password complexity
type PasswordCheckResult struct {
	Score       int      `json:"score"`
	Label       string   `json:"label"`
	Suggestions []string `json:"suggestions"`
}

func main() {
	// Set up logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("Starting backend server...")

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	} else {
		log.Println("Successfully loaded .env file")
	}

	// Get VirusTotal API key from environment
	vtAPIKey := os.Getenv("VIRUSTOTAL_API_KEY")
	if vtAPIKey == "" {
		log.Fatal("VIRUSTOTAL_API_KEY environment variable is required")
	}
	log.Println("VirusTotal API key found")

	// Create router
	r := mux.NewRouter()
	log.Println("Router created")

	// Define routes
	r.HandleFunc("/api/scan", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received scan request from %s", r.RemoteAddr)
		handleScanURL(w, r, vtAPIKey)
	}).Methods("POST")

	// Password check endpoint
	r.HandleFunc("/api/password-check", handlePasswordCheck).Methods("POST")
	log.Println("Routes defined")

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	log.Println("CORS configured")

	// Create server with CORS middleware
	handler := c.Handler(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func handleScanURL(w http.ResponseWriter, r *http.Request, apiKey string) {
	log.Printf("Handling scan request for URL")

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Parse request body
	var requestBody struct {
		URL string `json:"url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if requestBody.URL == "" {
		log.Printf("Empty URL received")
		http.Error(w, `{"error": "URL is required"}`, http.StatusBadRequest)
		return
	}

	log.Printf("Checking URL: %s", requestBody.URL)

	// Create VirusTotal API request
	vtURL := fmt.Sprintf("https://www.virustotal.com/vtapi/v2/url/report?apikey=%s&resource=%s", apiKey, requestBody.URL)
	log.Printf("Making request to VirusTotal API")

	resp, err := http.Get(vtURL)
	if err != nil {
		log.Printf("Error making request to VirusTotal: %v", err)
		json.NewEncoder(w).Encode(ScanResult{
			URL:   requestBody.URL,
			Error: "Failed to connect to VirusTotal",
		})
		return
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading VirusTotal response: %v", err)
		json.NewEncoder(w).Encode(ScanResult{
			URL:   requestBody.URL,
			Error: "Failed to read VirusTotal response",
		})
		return
	}

	log.Printf("Received response from VirusTotal: %s", string(body))

	// Parse VirusTotal response
	var vtResponse struct {
		ResponseCode int `json:"response_code"`
		Positives    int `json:"positives"`
		Total        int `json:"total"`
	}

	if err := json.Unmarshal(body, &vtResponse); err != nil {
		log.Printf("Error parsing VirusTotal response: %v", err)
		json.NewEncoder(w).Encode(ScanResult{
			URL:   requestBody.URL,
			Error: "Failed to parse VirusTotal response",
		})
		return
	}

	// Create our response
	result := ScanResult{
		URL:    requestBody.URL,
		Status: "success",
	}
	result.Details.TotalScans = vtResponse.Total
	result.Details.PositiveScans = vtResponse.Positives

	log.Printf("Sending response: %+v", result)
	json.NewEncoder(w).Encode(result)
}

func handlePasswordCheck(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling password check request")
	w.Header().Set("Content-Type", "application/json")

	var requestBody struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		log.Printf("Error decoding password check request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	if requestBody.Password == "" {
		log.Printf("Empty password received")
		http.Error(w, `{"error": "Password is required"}`, http.StatusBadRequest)
		return
	}

	result := checkPasswordComplexity(requestBody.Password)
	log.Printf("Password check result: %+v", result)
	json.NewEncoder(w).Encode(result)
}

// checkPasswordComplexity evaluates password strength
func checkPasswordComplexity(password string) PasswordCheckResult {
	score := 0
	suggestions := []string{}

	if len(password) >= 8 {
		score++
	} else {
		suggestions = append(suggestions, "Use at least 8 characters")
	}
	if len(password) >= 12 {
		score++
	} else {
		suggestions = append(suggestions, "Use at least 12 characters")
	}
	upper, lower, digit, special := false, false, false, false
	for _, c := range password {
		switch {
		case c >= 'A' && c <= 'Z':
			upper = true
		case c >= 'a' && c <= 'z':
			lower = true
		case c >= '0' && c <= '9':
			digit = true
		case (c >= 33 && c <= 47) || (c >= 58 && c <= 64) || (c >= 91 && c <= 96) || (c >= 123 && c <= 126):
			special = true
		}
	}
	if upper {
		score++
	} else {
		suggestions = append(suggestions, "Add uppercase letters")
	}
	if lower {
		score++
	} else {
		suggestions = append(suggestions, "Add lowercase letters")
	}
	if digit {
		score++
	} else {
		suggestions = append(suggestions, "Add numbers")
	}
	if special {
		score++
	} else {
		suggestions = append(suggestions, "Add special characters")
	}

	label := "Weak"
	if score >= 6 {
		label = "Strong"
	} else if score >= 4 {
		label = "Medium"
	}

	return PasswordCheckResult{
		Score:       score,
		Label:       label,
		Suggestions: suggestions,
	}
}
