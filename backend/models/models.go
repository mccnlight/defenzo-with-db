package models

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

// User represents a user in the system
type User struct {
	ID                int    `json:"id"`
	Email             string `json:"email"`
	FullName          string `json:"full_name"`
	ProfilePictureURL string `json:"profile_picture_url"`
	CreatedAt         string `json:"created_at"`
}

// Course represents a course in the system
type Course struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
	Duration    string   `json:"duration"`
	Progress    int      `json:"progress"`
	Level       string   `json:"level"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
	Rating      float64  `json:"rating"`
	Learners    int      `json:"learners"`
	Recommended bool     `json:"recommended"`
	Lessons     []Lesson `json:"lessons"`
}

// Lesson represents a lesson in a course
type Lesson struct {
	ID        string `json:"id"`
	CourseID  string `json:"course_id"`
	Title     string `json:"title"`
	Type      string `json:"type"`
	Duration  string `json:"duration"`
	Content   string `json:"content"`
	OrderNum  int    `json:"order_num"`
	Completed bool   `json:"completed"`
}

// UserProgress represents a user's progress in a course
type UserProgress struct {
	ID           int    `json:"id"`
	UserID       int    `json:"user_id"`
	CourseID     string `json:"course_id"`
	LessonID     string `json:"lesson_id,omitempty"`
	Completed    bool   `json:"completed"`
	Progress     int    `json:"progress"`
	LastAccessed string `json:"last_accessed"`
	CourseTitle  string `json:"course_title,omitempty"`
	LessonTitle  string `json:"lesson_title,omitempty"`
}
