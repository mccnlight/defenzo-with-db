package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"defenzo/config"
	"defenzo/middleware"
)

type Badge struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	Icon             string    `json:"icon"`
	Category         string    `json:"category"`
	RequirementType  string    `json:"requirement_type"`
	RequirementValue *int      `json:"requirement_value,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

type UserBadge struct {
	ID        int          `json:"id"`
	UserID    int          `json:"user_id"`
	BadgeID   string       `json:"badge_id"`
	Progress  int          `json:"progress"`
	Completed bool         `json:"completed"`
	AwardedAt sql.NullTime `json:"awarded_at"`
	Badge     Badge        `json:"badge"`
}

// initializeUserBadges creates initial badge entries for a user
func initializeUserBadges(userID int) error {
	// Get all badges
	rows, err := config.DB.Query("SELECT id FROM badges")
	if err != nil {
		return err
	}
	defer rows.Close()

	// Create a transaction
	tx, err := config.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// For each badge, create a user badge entry if it doesn't exist
	for rows.Next() {
		var badgeID string
		if err := rows.Scan(&badgeID); err != nil {
			return err
		}

		// Check if user badge already exists
		var exists bool
		err = tx.QueryRow("SELECT EXISTS(SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ?)", userID, badgeID).Scan(&exists)
		if err != nil {
			return err
		}

		if !exists {
			// Create new user badge entry
			_, err = tx.Exec(`
				INSERT INTO user_badges (user_id, badge_id, progress, completed, awarded_at)
				VALUES (?, ?, 0, 0, NULL)
			`, userID, badgeID)
			if err != nil {
				return err
			}
		}
	}

	// Commit the transaction
	return tx.Commit()
}

// GetUserBadges returns all badges for a user
func GetUserBadges(w http.ResponseWriter, r *http.Request) {
	log.Printf("Handling get user badges request")
	userID, err := middleware.GetUserID(r)
	if err != nil {
		log.Printf("Error getting user ID: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	log.Printf("Getting badges for user ID: %d", userID)

	// Initialize user badges if needed
	if err := initializeUserBadges(userID); err != nil {
		log.Printf("Error initializing user badges: %v", err)
		http.Error(w, "Failed to initialize badges", http.StatusInternalServerError)
		return
	}

	query := `
		SELECT ub.id, ub.user_id, ub.badge_id, ub.progress, ub.completed, ub.awarded_at,
			   b.id, b.name, b.description, b.icon, b.category, b.requirement_type, b.requirement_value, b.created_at
		FROM user_badges ub
		JOIN badges b ON ub.badge_id = b.id
		WHERE ub.user_id = ?
	`

	log.Printf("Executing query: %s with userID: %d", query, userID)
	rows, err := config.DB.Query(query, userID)
	if err != nil {
		log.Printf("Database error while fetching badges: %v", err)
		http.Error(w, "Failed to fetch badges", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var badges []UserBadge
	for rows.Next() {
		var ub UserBadge
		var badge Badge
		var requirementValue sql.NullInt64

		err := rows.Scan(
			&ub.ID, &ub.UserID, &ub.BadgeID, &ub.Progress, &ub.Completed, &ub.AwardedAt,
			&badge.ID, &badge.Name, &badge.Description, &badge.Icon, &badge.Category,
			&badge.RequirementType, &requirementValue, &badge.CreatedAt,
		)
		if err != nil {
			log.Printf("Error scanning badge row: %v", err)
			http.Error(w, "Failed to scan badge data", http.StatusInternalServerError)
			return
		}

		if requirementValue.Valid {
			value := int(requirementValue.Int64)
			badge.RequirementValue = &value
		}

		ub.Badge = badge
		badges = append(badges, ub)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating badge rows: %v", err)
		http.Error(w, "Failed to fetch badges", http.StatusInternalServerError)
		return
	}

	log.Printf("Found %d badges for user %d", len(badges), userID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(badges)
}

// UpdateBadgeProgress updates the progress of a badge for a user
func UpdateBadgeProgress(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(int)

	var req struct {
		BadgeID  int `json:"badge_id"`
		Progress int `json:"progress"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get badge requirement
	var requirementValue sql.NullInt64
	err := config.DB.QueryRow("SELECT requirement_value FROM badges WHERE id = $1", req.BadgeID).Scan(&requirementValue)
	if err != nil {
		http.Error(w, "Badge not found", http.StatusNotFound)
		return
	}

	// Check if badge is already completed
	var completed bool
	err = config.DB.QueryRow("SELECT completed FROM user_badges WHERE user_id = $1 AND badge_id = $2", userID, req.BadgeID).Scan(&completed)
	if err == sql.ErrNoRows {
		// Create new user badge entry
		_, err = config.DB.Exec(`
			INSERT INTO user_badges (user_id, badge_id, progress, completed)
			VALUES ($1, $2, $3, $4)
		`, userID, req.BadgeID, req.Progress, req.Progress >= int(requirementValue.Int64))
	} else if err != nil {
		http.Error(w, "Failed to check badge status", http.StatusInternalServerError)
		return
	} else if !completed {
		// Update existing badge progress
		_, err = config.DB.Exec(`
			UPDATE user_badges 
			SET progress = $1, 
				completed = $2,
				awarded_at = CASE WHEN $2 = true AND completed = false THEN CURRENT_TIMESTAMP ELSE awarded_at END
			WHERE user_id = $3 AND badge_id = $4
		`, req.Progress, req.Progress >= int(requirementValue.Int64), userID, req.BadgeID)
	}

	if err != nil {
		http.Error(w, "Failed to update badge progress", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// CheckAndAwardBadges checks and awards badges based on user actions
func CheckAndAwardBadges(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(int)

	var req struct {
		ActionType string                 `json:"action_type"`
		ActionData map[string]interface{} `json:"action_data"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Handle different action types
	switch req.ActionType {
	case "course_completion":
		courseID := int(req.ActionData["course_id"].(float64))
		// Award course completion badge
		_, err := config.DB.Exec(`
			INSERT INTO user_badges (user_id, badge_id, progress, completed, awarded_at)
			SELECT $1, b.id, 100, true, CURRENT_TIMESTAMP
			FROM badges b
			WHERE b.requirement_type = 'course_completion'
			AND b.name LIKE '%' || (SELECT title FROM courses WHERE id = $2) || '%'
			AND b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = $1)
		`, userID, courseID)
		if err != nil {
			http.Error(w, "Failed to award course completion badge", http.StatusInternalServerError)
			return
		}

	case "tool_usage":
		toolType := req.ActionData["tool_type"].(string)
		// Update tool usage badge progress
		_, err := config.DB.Exec(`
			UPDATE user_badges ub
			SET progress = progress + 1,
				completed = CASE 
					WHEN progress + 1 >= b.requirement_value THEN true 
					ELSE completed 
				END,
				awarded_at = CASE 
					WHEN progress + 1 >= b.requirement_value AND completed = false THEN CURRENT_TIMESTAMP 
					ELSE awarded_at 
				END
			FROM badges b
			WHERE ub.badge_id = b.id
			AND b.requirement_type = 'tool_usage'
			AND b.category = $1
			AND ub.user_id = $2
		`, toolType, userID)
		if err != nil {
			http.Error(w, "Failed to update tool usage badge", http.StatusInternalServerError)
			return
		}

	case "quiz_completion":
		score := int(req.ActionData["score"].(float64))
		// Update quiz performance badges
		_, err := config.DB.Exec(`
			UPDATE user_badges ub
			SET progress = progress + 1,
				completed = CASE 
					WHEN progress + 1 >= b.requirement_value THEN true 
					ELSE completed 
				END,
				awarded_at = CASE 
					WHEN progress + 1 >= b.requirement_value AND completed = false THEN CURRENT_TIMESTAMP 
					ELSE awarded_at 
				END
			FROM badges b
			WHERE ub.badge_id = b.id
			AND b.requirement_type IN ('high_scores', 'consistent_scores')
			AND ub.user_id = $1
			AND (
				(b.requirement_type = 'high_scores' AND $2 >= 90) OR
				(b.requirement_type = 'consistent_scores' AND $2 >= 80)
			)
		`, userID, score)
		if err != nil {
			http.Error(w, "Failed to update quiz badges", http.StatusInternalServerError)
			return
		}

		// Award perfect score badge if applicable
		if score == 100 {
			_, err = config.DB.Exec(`
				INSERT INTO user_badges (user_id, badge_id, progress, completed, awarded_at)
				SELECT $1, b.id, 1, true, CURRENT_TIMESTAMP
				FROM badges b
				WHERE b.requirement_type = 'perfect_score'
				AND b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = $1)
			`, userID)
			if err != nil {
				http.Error(w, "Failed to award perfect score badge", http.StatusInternalServerError)
				return
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}
