package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
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

var db *sql.DB
var jwtSecret = []byte("your_secret_key_here") // Change this to a secure random value in production

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "users.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	createTable := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		full_name TEXT,
		profile_picture_url TEXT,
		created_at DATETIME NOT NULL
	);`
	_, err = db.Exec(createTable)
	if err != nil {
		log.Fatalf("Failed to create users table: %v", err)
	}
	log.Println("Database initialized and users table ready.")

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS courses (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT,
		category TEXT,
		duration TEXT,
		progress INTEGER,
		level TEXT,
		tags TEXT,
		image TEXT,
		rating REAL,
		learners INTEGER,
		recommended BOOLEAN
	);
	`)
	if err != nil {
		log.Fatalf("Failed to create courses table: %v", err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS lessons (
		id TEXT PRIMARY KEY,
		course_id TEXT NOT NULL,
		title TEXT NOT NULL,
		type TEXT NOT NULL,
		duration TEXT,
		content TEXT,
		order_num INTEGER,
		completed BOOLEAN DEFAULT 0,
		FOREIGN KEY(course_id) REFERENCES courses(id)
	);
	`)
	if err != nil {
		log.Fatalf("Failed to create lessons table: %v", err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS user_course_progress (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		course_id TEXT NOT NULL,
		lesson_id TEXT,
		completed BOOLEAN NOT NULL DEFAULT 0,
		progress INTEGER NOT NULL DEFAULT 0,
		last_accessed DATETIME,
		UNIQUE(user_id, course_id, lesson_id)
	);
	`)
	if err != nil {
		log.Fatalf("Failed to create user_course_progress table: %v", err)
	}
}

func migrateDB() {
	// Add full_name column if it doesn't exist
	_, err := db.Exec(`
		ALTER TABLE users ADD COLUMN full_name TEXT;
	`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: full_name column may already exist: %v", err)
	}

	// Add profile_picture_url column if it doesn't exist
	_, err = db.Exec(`
		ALTER TABLE users ADD COLUMN profile_picture_url TEXT;
	`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: profile_picture_url column may already exist: %v", err)
	}
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

	// Serve static files from uploads directory
	fs := http.FileServer(http.Dir("uploads"))
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", fs))
	log.Println("Static file server configured for /uploads/")

	// Define routes
	r.HandleFunc("/api/scan", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received scan request from %s", r.RemoteAddr)
		handleScanURL(w, r, vtAPIKey)
	}).Methods("POST")

	// Password check endpoint
	r.HandleFunc("/api/password-check", handlePasswordCheck).Methods("POST")

	// Register endpoint
	r.HandleFunc("/api/register", handleRegister).Methods("POST")

	// Login endpoint
	r.HandleFunc("/api/login", handleLogin).Methods("POST")

	// Profile picture upload endpoint
	r.HandleFunc("/api/profile/picture", handleProfilePictureUpload).Methods("POST")

	// Profile endpoint
	r.HandleFunc("/api/profile", handleGetProfile).Methods("GET")

	// Courses endpoint
	r.HandleFunc("/api/courses", handleGetCourses).Methods("GET")
	r.HandleFunc("/api/courses/{id}", handleGetCourseByID).Methods("GET")

	// User progress endpoints
	r.HandleFunc("/api/user/progress", handleGetUserProgress).Methods("GET")
	r.HandleFunc("/api/user/progress", handleUpdateUserProgress).Methods("POST")

	log.Println("Routes defined")

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum age for browser to cache the response
	})
	log.Println("CORS configured")

	// Create server with CORS middleware
	handler := c.Handler(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	initDB()
	migrateDB()

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

func handleRegister(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling user registration request")
	w.Header().Set("Content-Type", "application/json")

	var requestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		log.Printf("Error decoding registration request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	if requestBody.Email == "" || requestBody.Password == "" {
		log.Printf("Empty email or password received")
		http.Error(w, `{"error": "Email and password are required"}`, http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var exists int
	err := db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", requestBody.Email).Scan(&exists)
	if err != nil {
		log.Printf("Database error: %v", err)
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	if exists > 0 {
		log.Printf("User already exists: %s", requestBody.Email)
		http.Error(w, `{"error": "User already exists"}`, http.StatusConflict)
		return
	}

	// Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(requestBody.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, `{"error": "Failed to hash password"}`, http.StatusInternalServerError)
		return
	}

	// Insert user into database
	_, err = db.Exec("INSERT INTO users (email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?)",
		requestBody.Email, string(hash), requestBody.FullName, time.Now())
	if err != nil {
		log.Printf("Error inserting user: %v", err)
		http.Error(w, `{"error": "Failed to register user"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("User registered: %s", requestBody.Email)
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"success": true}`))
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling user login request")
	w.Header().Set("Content-Type", "application/json")

	var requestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		log.Printf("Error decoding login request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	if requestBody.Email == "" || requestBody.Password == "" {
		log.Printf("Empty email or password received")
		http.Error(w, `{"error": "Email and password are required"}`, http.StatusBadRequest)
		return
	}

	// Look up user
	var id int
	var passwordHash string
	err := db.QueryRow("SELECT id, password_hash FROM users WHERE email = ?", requestBody.Email).Scan(&id, &passwordHash)
	if err == sql.ErrNoRows {
		log.Printf("User not found: %s", requestBody.Email)
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Printf("Database error: %v", err)
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(requestBody.Password))
	if err != nil {
		log.Printf("Invalid password for user: %s", requestBody.Email)
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	// Create JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
		"email":   requestBody.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Printf("Error signing JWT: %v", err)
		http.Error(w, `{"error": "Failed to create token"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("User logged in: %s", requestBody.Email)
	w.Write([]byte(fmt.Sprintf(`{"token": "%s"}`, tokenString)))
}

func handleProfilePictureUpload(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling profile picture upload request")

	// Get user ID from JWT token
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, `{"error": "Authorization token required"}`, http.StatusUnauthorized)
		return
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	// Parse and validate token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		log.Printf("Token validation error: %v", err)
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		log.Printf("Invalid token claims")
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
		return
	}

	userID, ok := claims["user_id"].(float64)
	if !ok {
		log.Printf("Invalid user ID in token")
		http.Error(w, `{"error": "Invalid user ID in token"}`, http.StatusUnauthorized)
		return
	}

	// Parse multipart form
	err = r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		log.Printf("Failed to parse form: %v", err)
		http.Error(w, `{"error": "Failed to parse form"}`, http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("profile_picture")
	if err != nil {
		log.Printf("Failed to get file: %v", err)
		http.Error(w, `{"error": "Failed to get file"}`, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create uploads directory if it doesn't exist
	uploadDir := "uploads/profile_pictures"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Printf("Error creating upload directory: %v", err)
		http.Error(w, `{"error": "Failed to create upload directory"}`, http.StatusInternalServerError)
		return
	}

	// Generate unique filename
	ext := filepath.Ext(handler.Filename)
	filename := fmt.Sprintf("%d_%d%s", int(userID), time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Create the file
	dst, err := os.Create(filepath)
	if err != nil {
		log.Printf("Error creating file: %v", err)
		http.Error(w, `{"error": "Failed to save file"}`, http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination file
	if _, err := io.Copy(dst, file); err != nil {
		log.Printf("Error copying file: %v", err)
		http.Error(w, `{"error": "Failed to save file"}`, http.StatusInternalServerError)
		return
	}

	// Update user's profile picture URL in database
	relativePath := "uploads/profile_pictures/" + filename
	_, err = db.Exec("UPDATE users SET profile_picture_url = ? WHERE id = ?", relativePath, int(userID))
	if err != nil {
		log.Printf("Error updating profile picture URL: %v", err)
		http.Error(w, `{"error": "Failed to update profile picture URL"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Profile picture uploaded successfully: %s", relativePath)

	// Return success response with the URL
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"profile_picture_url": relativePath,
	})
}

func handleGetProfile(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, `{"error": "Authorization token required"}`, http.StatusUnauthorized)
		return
	}
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
		return
	}
	userID, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, `{"error": "Invalid user ID in token"}`, http.StatusUnauthorized)
		return
	}

	var email, fullName, profilePictureURL sql.NullString
	err = db.QueryRow("SELECT email, full_name, profile_picture_url FROM users WHERE id = ?", int(userID)).Scan(&email, &fullName, &profilePictureURL)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":                  int(userID),
		"email":               email.String,
		"full_name":           fullName.String,
		"profile_picture_url": profilePictureURL.String,
	})
}

func handleGetCourses(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description, category, duration, progress, level, tags, image, rating, learners, recommended FROM courses")
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch courses"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []map[string]interface{}
	for rows.Next() {
		var c struct {
			ID, Title, Description, Category, Duration, Level, Tags, Image string
			Progress, Learners                                             int
			Rating                                                         float64
			Recommended                                                    bool
		}
		err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Category, &c.Duration, &c.Progress, &c.Level, &c.Tags, &c.Image, &c.Rating, &c.Learners, &c.Recommended)
		if err != nil {
			continue
		}

		// Fetch lessons for this course
		lessonRows, err := db.Query("SELECT id, course_id, title, type, duration, content, order_num, completed FROM lessons WHERE course_id = ? ORDER BY order_num", c.ID)
		if err != nil {
			courses = append(courses, map[string]interface{}{
				"id":          c.ID,
				"title":       c.Title,
				"description": c.Description,
				"category":    c.Category,
				"duration":    c.Duration,
				"progress":    c.Progress,
				"level":       c.Level,
				"tags":        c.Tags,
				"image":       c.Image,
				"rating":      c.Rating,
				"learners":    c.Learners,
				"recommended": c.Recommended,
				"lessons":     []map[string]interface{}{}, // fallback to empty lessons
			})
			continue
		}
		lessons := make([]map[string]interface{}, 0)
		for lessonRows.Next() {
			var l struct {
				ID, CourseID, Title, Type, Duration, Content string
				OrderNum, Completed                          int
			}
			err := lessonRows.Scan(&l.ID, &l.CourseID, &l.Title, &l.Type, &l.Duration, &l.Content, &l.OrderNum, &l.Completed)
			if err != nil {
				continue
			}
			lessons = append(lessons, map[string]interface{}{
				"id":        l.ID,
				"title":     l.Title,
				"type":      l.Type,
				"duration":  l.Duration,
				"content":   json.RawMessage(l.Content),
				"order_num": l.OrderNum,
				"completed": l.Completed,
			})
		}
		lessonRows.Close()

		courses = append(courses, map[string]interface{}{
			"id":          c.ID,
			"title":       c.Title,
			"description": c.Description,
			"category":    c.Category,
			"duration":    c.Duration,
			"progress":    c.Progress,
			"level":       c.Level,
			"tags":        c.Tags,
			"image":       c.Image,
			"rating":      c.Rating,
			"learners":    c.Learners,
			"recommended": c.Recommended,
			"lessons":     lessons,
		})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

func handleGetCourseByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	courseID := vars["id"]

	var course struct {
		ID, Title, Description, Category, Duration, Level, Tags, Image string
		Progress, Learners                                             int
		Rating                                                         float64
		Recommended                                                    bool
	}
	err := db.QueryRow("SELECT id, title, description, category, duration, progress, level, tags, image, rating, learners, recommended FROM courses WHERE id = ?", courseID).
		Scan(&course.ID, &course.Title, &course.Description, &course.Category, &course.Duration, &course.Progress, &course.Level, &course.Tags, &course.Image, &course.Rating, &course.Learners, &course.Recommended)
	if err != nil {
		http.Error(w, `{"error": "Course not found"}`, http.StatusNotFound)
		return
	}

	lessonRows, err := db.Query("SELECT id, course_id, title, type, duration, content, order_num, completed FROM lessons WHERE course_id = ? ORDER BY order_num", courseID)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch lessons"}`, http.StatusInternalServerError)
		return
	}
	defer lessonRows.Close()

	lessons := make([]map[string]interface{}, 0) // Always initialize as empty array
	for lessonRows.Next() {
		var l struct {
			ID, CourseID, Title, Type, Duration, Content string
			OrderNum, Completed                          int
		}
		err := lessonRows.Scan(&l.ID, &l.CourseID, &l.Title, &l.Type, &l.Duration, &l.Content, &l.OrderNum, &l.Completed)
		if err != nil {
			continue
		}
		lessons = append(lessons, map[string]interface{}{
			"id":        l.ID,
			"title":     l.Title,
			"type":      l.Type,
			"duration":  l.Duration,
			"content":   json.RawMessage(l.Content),
			"order_num": l.OrderNum,
			"completed": l.Completed,
		})
	}

	log.Printf("Found %d lessons for course %s", len(lessons), courseID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":          course.ID,
		"title":       course.Title,
		"description": course.Description,
		"category":    course.Category,
		"duration":    course.Duration,
		"progress":    course.Progress,
		"level":       course.Level,
		"tags":        course.Tags,
		"image":       course.Image,
		"rating":      course.Rating,
		"learners":    course.Learners,
		"recommended": course.Recommended,
		"lessons":     lessons, // Always an array
	})
}

// Handler to get user progress
func handleGetUserProgress(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, `{"error": "user_id required"}`, http.StatusBadRequest)
		return
	}
	rows, err := db.Query("SELECT course_id, lesson_id, completed, progress, last_accessed FROM user_course_progress WHERE user_id = ?", userID)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch progress"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var progress []map[string]interface{}
	for rows.Next() {
		var courseID, lessonID sql.NullString
		var completed bool
		var prog int
		var lastAccessed sql.NullString
		err := rows.Scan(&courseID, &lessonID, &completed, &prog, &lastAccessed)
		if err != nil {
			continue
		}
		progress = append(progress, map[string]interface{}{
			"course_id":     courseID.String,
			"lesson_id":     lessonID.String,
			"completed":     completed,
			"progress":      prog,
			"last_accessed": lastAccessed.String,
		})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progress)
}

// Handler to update user progress
func handleUpdateUserProgress(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID    int    `json:"user_id"`
		CourseID  string `json:"course_id"`
		LessonID  string `json:"lesson_id"`
		Completed bool   `json:"completed"`
		Progress  int    `json:"progress"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	_, err := db.Exec(`INSERT OR REPLACE INTO user_course_progress (user_id, course_id, lesson_id, completed, progress, last_accessed) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
		req.UserID, req.CourseID, req.LessonID, req.Completed, req.Progress)
	if err != nil {
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true}`))
}
