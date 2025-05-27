package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nurpe/defenzo/config"
	"github.com/nurpe/defenzo/middleware"
	"github.com/nurpe/defenzo/models"
)

// GetCourses handles getting all courses
func GetCourses(w http.ResponseWriter, r *http.Request) {
	userID, _ := middleware.GetUserID(r) // If not authenticated, userID will be 0

	rows, err := config.DB.Query(`
		SELECT id, title, description, category, duration, progress, level, tags, image, rating, learners, recommended
		FROM courses
		ORDER BY recommended DESC, rating DESC
	`)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch courses"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var courses []models.Course
	for rows.Next() {
		var course models.Course
		var tags string
		err := rows.Scan(
			&course.ID,
			&course.Title,
			&course.Description,
			&course.Category,
			&course.Duration,
			&course.Progress,
			&course.Level,
			&tags,
			&course.Image,
			&course.Rating,
			&course.Learners,
			&course.Recommended,
		)
		if err != nil {
			http.Error(w, `{"error": "Failed to scan course data"}`, http.StatusInternalServerError)
			return
		}

		// Parse tags from JSON string
		if err := json.Unmarshal([]byte(tags), &course.Tags); err != nil {
			http.Error(w, `{"error": "Failed to parse course tags"}`, http.StatusInternalServerError)
			return
		}

		// If user is authenticated, get their LATEST course-level progress
		if userID > 0 {
			var userProgress sql.NullInt64
			err := config.DB.QueryRow(
				`SELECT progress FROM user_course_progress WHERE user_id = ? AND course_id = ? AND lesson_id IS NULL ORDER BY last_accessed DESC LIMIT 1`,
				userID, course.ID,
			).Scan(&userProgress)
			if err == nil && userProgress.Valid {
				course.Progress = int(userProgress.Int64)
			} else {
				// If no progress found (sql.ErrNoRows) or invalid, default to 0
				course.Progress = 0
			}
		}

		// Get lessons for the course
		lessonRows, err := config.DB.Query(`
			SELECT id, title, type, duration, content, order_num, completed
			FROM lessons
			WHERE course_id = ?
			ORDER BY order_num
		`, course.ID)
		if err != nil {
			http.Error(w, `{"error": "Failed to fetch lessons for course"}`, http.StatusInternalServerError)
			return
		}
		defer lessonRows.Close()

		var lessons []models.Lesson
		for lessonRows.Next() {
			var lesson models.Lesson
			err := lessonRows.Scan(
				&lesson.ID,
				&lesson.Title,
				&lesson.Type,
				&lesson.Duration,
				&lesson.Content,
				&lesson.OrderNum,
				&lesson.Completed,
			)
			if err != nil {
				http.Error(w, `{"error": "Failed to scan lesson data"}`, http.StatusInternalServerError)
				return
			}
			lesson.CourseID = course.ID
			lessons = append(lessons, lesson)
		}

		course.Lessons = lessons
		courses = append(courses, course)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// GetCourseByID handles getting a specific course by ID
func GetCourseByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	courseID := vars["id"]

	var course models.Course
	var tags string
	err := config.DB.QueryRow(`
		SELECT id, title, description, category, duration, progress, level, tags, image, rating, learners, recommended
		FROM courses
		WHERE id = ?
	`, courseID).Scan(
		&course.ID,
		&course.Title,
		&course.Description,
		&course.Category,
		&course.Duration,
		&course.Progress,
		&course.Level,
		&tags,
		&course.Image,
		&course.Rating,
		&course.Learners,
		&course.Recommended,
	)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Course not found"}`, http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, `{"error": "Failed to fetch course"}`, http.StatusInternalServerError)
		return
	}

	// Parse tags from JSON string
	if err := json.Unmarshal([]byte(tags), &course.Tags); err != nil {
		http.Error(w, `{"error": "Failed to parse course tags"}`, http.StatusInternalServerError)
		return
	}

	// Get lessons for the course
	rows, err := config.DB.Query(`
		SELECT id, title, type, duration, content, order_num, completed
		FROM lessons
		WHERE course_id = ?
		ORDER BY order_num
	`, courseID)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch lessons"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var lessons []models.Lesson
	for rows.Next() {
		var lesson models.Lesson
		err := rows.Scan(
			&lesson.ID,
			&lesson.Title,
			&lesson.Type,
			&lesson.Duration,
			&lesson.Content,
			&lesson.OrderNum,
			&lesson.Completed,
		)
		if err != nil {
			http.Error(w, `{"error": "Failed to scan lesson data"}`, http.StatusInternalServerError)
			return
		}
		lesson.CourseID = courseID
		lessons = append(lessons, lesson)
	}

	course.Lessons = lessons

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}
