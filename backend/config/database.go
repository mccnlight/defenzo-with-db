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

	// Create index for faster progress lookups
	createIndex := `CREATE INDEX IF NOT EXISTS idx_user_course_progress 
		ON user_course_progress(user_id, course_id, lesson_id);`
	_, err = DB.Exec(createIndex)
	if err != nil {
		log.Fatalf("Failed to create index: %v", err)
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
}
