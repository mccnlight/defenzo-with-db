package handlers

import (
	"defenzo/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// ScanURL handles URL scanning using VirusTotal
func ScanURL(w http.ResponseWriter, r *http.Request) {
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

	// Get VirusTotal API key from environment
	vtAPIKey := os.Getenv("VIRUSTOTAL_API_KEY")
	if vtAPIKey == "" {
		log.Printf("VirusTotal API key not found")
		http.Error(w, `{"error": "VirusTotal API key not configured"}`, http.StatusInternalServerError)
		return
	}

	// Create VirusTotal API request
	vtURL := fmt.Sprintf("https://www.virustotal.com/vtapi/v2/url/report?apikey=%s&resource=%s", vtAPIKey, requestBody.URL)
	log.Printf("Making request to VirusTotal API")

	resp, err := http.Get(vtURL)
	if err != nil {
		log.Printf("Error making request to VirusTotal: %v", err)
		json.NewEncoder(w).Encode(models.ScanResult{
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
		json.NewEncoder(w).Encode(models.ScanResult{
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
		json.NewEncoder(w).Encode(models.ScanResult{
			URL:   requestBody.URL,
			Error: "Failed to parse VirusTotal response",
		})
		return
	}

	// Create our response
	result := models.ScanResult{
		URL:    requestBody.URL,
		Status: "success",
	}
	result.Details.TotalScans = vtResponse.Total
	result.Details.PositiveScans = vtResponse.Positives

	log.Printf("Sending response: %+v", result)
	json.NewEncoder(w).Encode(result)
}

// CheckPassword handles password complexity checking
func CheckPassword(w http.ResponseWriter, r *http.Request) {
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
func checkPasswordComplexity(password string) models.PasswordCheckResult {
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

	return models.PasswordCheckResult{
		Score:       score,
		Label:       label,
		Suggestions: suggestions,
	}
}
