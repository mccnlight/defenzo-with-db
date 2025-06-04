package config

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

// InitDB initializes the database connection and creates necessary tables
func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "users.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Create users table
	createUsersTable := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		full_name TEXT,
		profile_picture_url TEXT,
		created_at DATETIME NOT NULL
	);`
	_, err = DB.Exec(createUsersTable)
	if err != nil {
		log.Fatalf("Failed to create users table: %v", err)
	}

	// Create courses table
	createCoursesTable := `CREATE TABLE IF NOT EXISTS courses (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT,
		category TEXT,
		duration TEXT,
		progress INTEGER DEFAULT 0,
		level TEXT,
		tags TEXT,
		image TEXT,
		rating REAL,
		learners INTEGER DEFAULT 0,
		recommended BOOLEAN DEFAULT 0
	);`
	_, err = DB.Exec(createCoursesTable)
	if err != nil {
		log.Fatalf("Failed to create courses table: %v", err)
	}

	// Create lessons table
	createLessonsTable := `CREATE TABLE IF NOT EXISTS lessons (
		id TEXT PRIMARY KEY,
		course_id TEXT NOT NULL,
		title TEXT NOT NULL,
		type TEXT NOT NULL,
		duration TEXT,
		content TEXT,
		order_num INTEGER,
		completed BOOLEAN DEFAULT 0,
		FOREIGN KEY(course_id) REFERENCES courses(id)
	);`
	_, err = DB.Exec(createLessonsTable)
	if err != nil {
		log.Fatalf("Failed to create lessons table: %v", err)
	}

	// Create user_course_progress table with proper constraints
	createProgressTable := `CREATE TABLE IF NOT EXISTS user_course_progress (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		course_id TEXT NOT NULL,
		lesson_id TEXT,
		completed BOOLEAN NOT NULL DEFAULT 0,
		progress INTEGER NOT NULL DEFAULT 0,
		last_accessed DATETIME NOT NULL,
		FOREIGN KEY(user_id) REFERENCES users(id),
		FOREIGN KEY(course_id) REFERENCES courses(id),
		FOREIGN KEY(lesson_id) REFERENCES lessons(id),
		UNIQUE(user_id, course_id, lesson_id)
	);`
	_, err = DB.Exec(createProgressTable)
	if err != nil {
		log.Fatalf("Failed to create user_course_progress table: %v", err)
	}

	// Create badges table
	createBadgesTable := `CREATE TABLE IF NOT EXISTS badges (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		icon TEXT NOT NULL,
		category TEXT NOT NULL,
		requirement_type TEXT NOT NULL,
		requirement_value INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`
	_, err = DB.Exec(createBadgesTable)
	if err != nil {
		log.Fatalf("Failed to create badges table: %v", err)
	}

	// Create user_badges table
	createUserBadgesTable := `CREATE TABLE IF NOT EXISTS user_badges (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		badge_id TEXT NOT NULL,
		progress INTEGER DEFAULT 0,
		completed BOOLEAN DEFAULT 0,
		awarded_at DATETIME,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY(badge_id) REFERENCES badges(id) ON DELETE CASCADE,
		UNIQUE(user_id, badge_id)
	);`
	_, err = DB.Exec(createUserBadgesTable)
	if err != nil {
		log.Fatalf("Failed to create user_badges table: %v", err)
	}

	// Create index for faster progress lookups
	createIndex := `CREATE INDEX IF NOT EXISTS idx_user_course_progress 
		ON user_course_progress(user_id, course_id, lesson_id);`
	_, err = DB.Exec(createIndex)
	if err != nil {
		log.Fatalf("Failed to create index: %v", err)
	}

	// Run migrations first
	MigrateDB()

	// Insert default badges if they don't exist
	insertDefaultBadges := `
	INSERT OR IGNORE INTO badges (id, name, description, icon, category, requirement_type, requirement_value) VALUES
	-- Course Completion Badges
	('course_complete_basics', 'Course Master: Cybersecurity Basics', 'Complete the Cybersecurity Basics course', '🎓', 'course_completion', 'course_completion', NULL),
	('course_complete_password', 'Course Master: Password Security', 'Complete the Password Security course', '🎓', 'course_completion', 'course_completion', NULL),
	('course_complete_web', 'Course Master: Web Safety', 'Complete the Web Safety course', '🎓', 'course_completion', 'course_completion', NULL),

	-- Security Tool Usage Badges
	('tool_password', 'Password Guardian', 'Check passwords using the password checker tool', '🔐', 'tool_usage', 'tool_usage', 5),
	('tool_url', 'URL Defender', 'Scan URLs using the URL scanner tool', '🌐', 'tool_usage', 'tool_usage', 5),
	('tool_email', 'Email Protector', 'Check emails using the email checker tool', '📧', 'tool_usage', 'tool_usage', 5),

	-- Learning Progress Badges
	('progress_quick', 'Quick Learner', 'Complete 5 courses', '🚀', 'learning_progress', 'courses_completed', 5),
	('progress_dedicated', 'Dedicated Student', 'Complete 10 courses', '📚', 'learning_progress', 'courses_completed', 10),
	('progress_expert', 'Security Expert', 'Complete 20 courses', '🛡️', 'learning_progress', 'courses_completed', 20),
	('progress_master', 'Master of Security', 'Complete all available courses', '👑', 'learning_progress', 'all_courses_completed', NULL),

	-- Quiz Performance Badges
	('quiz_champion', 'Quiz Champion', 'Score 90% or higher in 5 quizzes', '🏆', 'quiz_performance', 'high_scores', 5),
	('quiz_perfect', 'Perfect Score', 'Get 100% in any quiz', '💯', 'quiz_performance', 'perfect_score', 1),
	('quiz_consistent', 'Consistent Learner', 'Complete 10 quizzes with 80% or higher score', '📝', 'quiz_performance', 'consistent_scores', 10);`
	_, err = DB.Exec(insertDefaultBadges)
	if err != nil {
		log.Fatalf("Failed to insert default badges: %v", err)
	}

	log.Println("Database initialized and tables ready.")
}

// MigrateDB performs database migrations
func MigrateDB() {
	// Add full_name column if it doesn't exist
	_, err := DB.Exec(`ALTER TABLE users ADD COLUMN full_name TEXT;`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: full_name column may already exist: %v", err)
	}

	// Add profile_picture_url column if it doesn't exist
	_, err = DB.Exec(`ALTER TABLE users ADD COLUMN profile_picture_url TEXT;`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: profile_picture_url column may already exist: %v", err)
	}

	// Add requirement_type column to badges table if it doesn't exist
	_, err = DB.Exec(`ALTER TABLE badges ADD COLUMN requirement_type TEXT;`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: requirement_type column may already exist: %v", err)
	}

	// Add requirement_value column to badges table if it doesn't exist
	_, err = DB.Exec(`ALTER TABLE badges ADD COLUMN requirement_value INTEGER;`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: requirement_value column may already exist: %v", err)
	}

	// Add category column to badges table if it doesn't exist
	_, err = DB.Exec(`ALTER TABLE badges ADD COLUMN category TEXT;`)
	if err != nil {
		// Ignore error if column already exists
		log.Printf("Note: category column may already exist: %v", err)
	}
}
