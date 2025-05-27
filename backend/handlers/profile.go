package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/nurpe/defenzo/config"
	"github.com/nurpe/defenzo/middleware"
)

// UploadProfilePicture handles profile picture upload
func UploadProfilePicture(w http.ResponseWriter, r *http.Request) {
	userID, err := middleware.GetUserID(r)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	// Parse multipart form
	err = r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		http.Error(w, `{"error": "Failed to parse form"}`, http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("profile_picture")
	if err != nil {
		http.Error(w, `{"error": "Failed to get file"}`, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create uploads directory if it doesn't exist
	uploadDir := "uploads/profile_pictures"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		http.Error(w, `{"error": "Failed to create upload directory"}`, http.StatusInternalServerError)
		return
	}

	// Generate unique filename
	ext := filepath.Ext(handler.Filename)
	filename := fmt.Sprintf("%d_%d%s", userID, time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Create the file
	dst, err := os.Create(filepath)
	if err != nil {
		http.Error(w, `{"error": "Failed to save file"}`, http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination file
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, `{"error": "Failed to save file"}`, http.StatusInternalServerError)
		return
	}

	// Update user's profile picture URL in database
	relativePath := "uploads/profile_pictures/" + filename
	_, err = config.DB.Exec("UPDATE users SET profile_picture_url = ? WHERE id = ?", relativePath, userID)
	if err != nil {
		http.Error(w, `{"error": "Failed to update profile picture URL"}`, http.StatusInternalServerError)
		return
	}

	// Return success response with the URL
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"profile_picture_url": relativePath,
	})
}
