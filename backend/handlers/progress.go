package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"math"
	"net/http"
	"time"

	"defenzo/config"
	"defenzo/middleware"
	"defenzo/models"

	"github.com/gorilla/mux"
)

// GetUserProgress handles getting user's course progress
func GetUserProgress(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling get user progress request")
	userID, err := middleware.GetUserID(r)
	if err != nil {
		log.Printf("Error getting user ID from request: %v", err)
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	log.Printf("Getting progress for user ID: %d", userID)

	// Get all progress records for the user
	rows, err := config.DB.Query(`
		SELECT p.id, p.user_id, p.course_id, p.lesson_id, p.completed, p.progress, p.last_accessed,
			   c.title as course_title, l.title as lesson_title
		FROM user_course_progress p
		LEFT JOIN courses c ON p.course_id = c.id
		LEFT JOIN lessons l ON p.lesson_id = l.id
		WHERE p.user_id = ?
		ORDER BY p.course_id, p.lesson_id
	`, userID)
	if err != nil {
		log.Printf("Database error while fetching progress: %v", err)
		http.Error(w, `{"error": "Failed to fetch progress"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var progress []models.UserProgress
	for rows.Next() {
		var p models.UserProgress
		var lessonID sql.NullString
		var courseTitle, lessonTitle sql.NullString
		err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.CourseID,
			&lessonID,
			&p.Completed,
			&p.Progress,
			&p.LastAccessed,
			&courseTitle,
			&lessonTitle,
		)
		if err != nil {
			log.Printf("Error scanning progress row: %v", err)
			continue
		}

		p.LessonID = lessonID.String
		p.CourseTitle = courseTitle.String
		p.LessonTitle = lessonTitle.String

		progress = append(progress, p)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating progress rows: %v", err)
		http.Error(w, `{"error": "Failed to fetch progress"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Found %d progress records for user %d", len(progress), userID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progress)
}

// UpdateUserProgress handles updating user's course progress
func UpdateUserProgress(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling update user progress request")
	userID, err := middleware.GetUserID(r)
	if err != nil {
		log.Printf("Error getting user ID from request: %v", err)
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	log.Printf("Updating progress for user ID: %d", userID)

	// Log the raw request body for debugging
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	log.Printf("Raw request body: %s", string(bodyBytes))

	// Create a new reader with the body bytes for the decoder
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	var progress models.UserProgress
	if err := json.NewDecoder(r.Body).Decode(&progress); err != nil {
		log.Printf("Error decoding progress update request: %v", err)
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Log the decoded progress object
	log.Printf("Decoded progress object: %+v", progress)

	// Validate required fields
	if progress.CourseID == "" {
		log.Printf("Missing course_id in request")
		http.Error(w, `{"error": "course_id is required"}`, http.StatusBadRequest)
		return
	}

	// Verify course exists
	var courseExists bool
	err = config.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM courses WHERE id = ?)", progress.CourseID).Scan(&courseExists)
	if err != nil {
		log.Printf("Error checking if course exists: %v", err)
		http.Error(w, `{"error": "Failed to verify course"}`, http.StatusInternalServerError)
		return
	}
	if !courseExists {
		log.Printf("Course not found: %s", progress.CourseID)
		http.Error(w, `{"error": "Course not found"}`, http.StatusBadRequest)
		return
	}

	// If lesson_id is provided, verify it exists
	if progress.LessonID != "" {
		var lessonExists bool
		err = config.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM lessons WHERE id = ? AND course_id = ?)",
			progress.LessonID, progress.CourseID).Scan(&lessonExists)
		if err != nil {
			log.Printf("Error checking if lesson exists: %v", err)
			http.Error(w, `{"error": "Failed to verify lesson"}`, http.StatusInternalServerError)
			return
		}
		if !lessonExists {
			log.Printf("Lesson not found: %s", progress.LessonID)
			http.Error(w, `{"error": "Lesson not found"}`, http.StatusBadRequest)
			return
		}
	}

	log.Printf("Received progress update: CourseID=%s, LessonID=%s, Completed=%v, Progress=%d",
		progress.CourseID, progress.LessonID, progress.Completed, progress.Progress)

	// Start a transaction
	tx, err := config.DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// If lesson is completed, update the lesson progress
	if progress.LessonID != "" {
		log.Printf("Updating lesson progress for lesson %s", progress.LessonID)
		_, err = tx.Exec(`
			INSERT INTO user_course_progress (user_id, course_id, lesson_id, completed, progress, last_accessed)
			VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(user_id, course_id, lesson_id) DO UPDATE SET
				completed = excluded.completed,
				progress = excluded.progress,
				last_accessed = excluded.last_accessed
		`,
			userID,
			progress.CourseID,
			progress.LessonID,
			progress.Completed,
			progress.Progress,
			time.Now().Format(time.RFC3339),
		)
		if err != nil {
			log.Printf("Error updating lesson progress: %v", err)
			http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
			return
		}
		log.Printf("Successfully updated lesson progress")
	}

	// Calculate overall course progress
	var totalLessons int
	var completedLessons int
	err = tx.QueryRow(`
		SELECT COUNT(*) FROM lessons WHERE course_id = ?
	`, progress.CourseID).Scan(&totalLessons)
	if err != nil {
		log.Printf("Error counting total lessons: %v", err)
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}
	log.Printf("Total lessons in course: %d", totalLessons)

	err = tx.QueryRow(`
		SELECT COUNT(*) FROM user_course_progress
		WHERE user_id = ? AND course_id = ? AND completed = 1
	`, userID, progress.CourseID).Scan(&completedLessons)
	if err != nil {
		log.Printf("Error counting completed lessons: %v", err)
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}
	log.Printf("Completed lessons: %d", completedLessons)

	// Calculate percentage using floating point and round (matching frontend)
	courseProgress := 0
	if totalLessons > 0 {
		courseProgress = int(math.Round(float64(completedLessons) / float64(totalLessons) * 100))
	}
	log.Printf("Calculated course progress (backend): %d%%", courseProgress)

	// Update course progress (row with lesson_id IS NULL)
	log.Printf("Updating course progress")
	_, err = tx.Exec(`
		INSERT INTO user_course_progress (user_id, course_id, lesson_id, completed, progress, last_accessed)
		VALUES (?, ?, NULL, ?, ?, ?)
		ON CONFLICT(user_id, course_id, lesson_id) DO UPDATE SET
			completed = excluded.completed,
			progress = excluded.progress,
			last_accessed = excluded.last_accessed
	`,
		userID,
		progress.CourseID,
		completedLessons == totalLessons, // Course is completed if all lessons are completed
		courseProgress,
		time.Now().Format(time.RFC3339),
	)
	if err != nil {
		log.Printf("Error updating course progress: %v", err)
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Successfully updated progress for user %d: Course=%s, Progress=%d%%",
		userID, progress.CourseID, courseProgress)

	// Return updated progress
	progress.Progress = courseProgress
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progress)
}

// UpdateLessonProgress handles updating a user's progress for a specific lesson
func UpdateLessonProgress(w http.ResponseWriter, r *http.Request) {
	userID, err := middleware.GetUserID(r)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	courseID := vars["courseId"]
	lessonID := vars["lessonId"]

	var progressData struct {
		Completed bool `json:"completed"`
		Progress  int  `json:"progress"`
		// Add fields for chat simulation
		SelectedResponses []string `json:"selectedResponses,omitempty"`
		Outcome           string   `json:"outcome,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&progressData); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Get lesson type
	var lessonType string
	err = config.DB.QueryRow("SELECT type FROM lessons WHERE id = ? AND course_id = ?", lessonID, courseID).Scan(&lessonType)
	if err != nil {
		http.Error(w, `{"error": "Lesson not found"}`, http.StatusNotFound)
		return
	}

	// For chat simulation, store additional data
	var contentData []byte
	if lessonType == "chat_simulation" {
		contentData, err = json.Marshal(map[string]interface{}{
			"selectedResponses": progressData.SelectedResponses,
			"outcome":           progressData.Outcome,
		})
		if err != nil {
			http.Error(w, `{"error": "Failed to process progress data"}`, http.StatusInternalServerError)
			return
		}
	}

	// Update or insert progress
	_, err = config.DB.Exec(`
		INSERT INTO user_course_progress (user_id, course_id, lesson_id, completed, progress, content_data, last_accessed)
		VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON DUPLICATE KEY UPDATE
		completed = VALUES(completed),
		progress = VALUES(progress),
		content_data = VALUES(content_data),
		last_accessed = CURRENT_TIMESTAMP
	`, userID, courseID, lessonID, progressData.Completed, progressData.Progress, contentData)

	if err != nil {
		http.Error(w, `{"error": "Failed to update progress"}`, http.StatusInternalServerError)
		return
	}

	// Update course-level progress
	if progressData.Completed {
		// Count total lessons and completed lessons
		var totalLessons, completedLessons int
		err = config.DB.QueryRow(`
			SELECT 
				(SELECT COUNT(*) FROM lessons WHERE course_id = ?) as total,
				(SELECT COUNT(*) FROM user_course_progress 
				WHERE user_id = ? AND course_id = ? AND completed = true) as completed
		`, courseID, userID, courseID).Scan(&totalLessons, &completedLessons)
		if err != nil {
			http.Error(w, `{"error": "Failed to calculate course progress"}`, http.StatusInternalServerError)
			return
		}

		// Calculate course progress percentage
		courseProgress := 0
		if totalLessons > 0 {
			courseProgress = (completedLessons * 100) / totalLessons
		}

		// Update course-level progress
		_, err = config.DB.Exec(`
			INSERT INTO user_course_progress (user_id, course_id, completed, progress, last_accessed)
			VALUES (?, ?, true, ?, CURRENT_TIMESTAMP)
			ON DUPLICATE KEY UPDATE
			completed = VALUES(completed),
			progress = VALUES(progress),
			last_accessed = CURRENT_TIMESTAMP
		`, userID, courseID, courseProgress)
		if err != nil {
			http.Error(w, `{"error": "Failed to update course progress"}`, http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Progress updated successfully",
		"completed": progressData.Completed,
		"progress":  progressData.Progress,
	})
}
