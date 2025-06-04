package handlers

import (
	"database/sql"
	"defenzo/config"
	"defenzo/middleware"
	"defenzo/models"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Register handles user registration
func Register(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling registration request")
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		log.Printf("Error decoding registration request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	log.Printf("Registering user with email: %s, full name: %s", credentials.Email, credentials.FullName)

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(credentials.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, `{"error": "Failed to hash password"}`, http.StatusInternalServerError)
		return
	}

	// Insert user into database
	result, err := config.DB.Exec(
		"INSERT INTO users (email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?)",
		credentials.Email,
		string(hashedPassword),
		credentials.FullName,
		time.Now().Format(time.RFC3339),
	)
	if err != nil {
		log.Printf("Error inserting user into database: %v", err)
		http.Error(w, `{"error": "Email already exists"}`, http.StatusBadRequest)
		return
	}

	userID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID: %v", err)
		http.Error(w, `{"error": "Failed to get user ID"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully registered user with ID: %d", userID)

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // Token expires in 7 days
	})

	tokenString, err := token.SignedString(middleware.JWTSecret)
	if err != nil {
		log.Printf("Error generating JWT token: %v", err)
		http.Error(w, `{"error": "Failed to generate token"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

// Login handles user login
func Login(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling login request")
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		log.Printf("Error decoding login request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	log.Printf("Attempting login for email: %s", credentials.Email)

	// Get user from database
	var user models.User
	var passwordHash string
	err := config.DB.QueryRow(
		"SELECT id, email, full_name, password_hash FROM users WHERE email = ?",
		credentials.Email,
	).Scan(&user.ID, &user.Email, &user.FullName, &passwordHash)
	if err == sql.ErrNoRows {
		log.Printf("User not found: %s", credentials.Email)
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Printf("Database error during login: %v", err)
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Found user: ID=%d, Email=%s, FullName=%s", user.ID, user.Email, user.FullName)

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(credentials.Password))
	if err != nil {
		log.Printf("Invalid password for user: %s", credentials.Email)
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // Token expires in 7 days
	})

	tokenString, err := token.SignedString(middleware.JWTSecret)
	if err != nil {
		log.Printf("Error generating JWT token: %v", err)
		http.Error(w, `{"error": "Failed to generate token"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully logged in user: %s", user.Email)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

// GetProfile handles getting user profile
func GetProfile(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling get profile request")
	userID, err := middleware.GetUserID(r)
	if err != nil {
		log.Printf("Error getting user ID from request: %v", err)
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	log.Printf("Getting profile for user ID: %d", userID)

	var user models.User
	var fullName, profilePictureURL sql.NullString
	err = config.DB.QueryRow(
		"SELECT id, email, full_name, profile_picture_url, created_at FROM users WHERE id = ?",
		userID,
	).Scan(&user.ID, &user.Email, &fullName, &profilePictureURL, &user.CreatedAt)
	if err != nil {
		log.Printf("Error getting user profile: %v", err)
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	// Convert NullString to string, using empty string if NULL
	user.FullName = fullName.String
	user.ProfilePictureURL = profilePictureURL.String

	log.Printf("Found user profile: ID=%d, Email=%s, FullName=%s", user.ID, user.Email, user.FullName)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
