-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Insert default badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
-- Course Completion Badges
('Course Master: Cybersecurity Basics', 'Complete the Cybersecurity Basics course', '🎓', 'course_completion', 'course_completion', NULL),
('Course Master: Password Security', 'Complete the Password Security course', '🎓', 'course_completion', 'course_completion', NULL),
('Course Master: Web Safety', 'Complete the Web Safety course', '🎓', 'course_completion', 'course_completion', NULL),

-- Security Tool Usage Badges
('Password Guardian', 'Check passwords using the password checker tool', '🔐', 'tool_usage', 'tool_usage', 5),
('URL Defender', 'Scan URLs using the URL scanner tool', '🌐', 'tool_usage', 'tool_usage', 5),
('Email Protector', 'Check emails using the email checker tool', '📧', 'tool_usage', 'tool_usage', 5),

-- Learning Progress Badges
('Quick Learner', 'Complete 5 courses', '🚀', 'learning_progress', 'courses_completed', 5),
('Dedicated Student', 'Complete 10 courses', '📚', 'learning_progress', 'courses_completed', 10),
('Security Expert', 'Complete 20 courses', '🛡️', 'learning_progress', 'courses_completed', 20),
('Master of Security', 'Complete all available courses', '👑', 'learning_progress', 'all_courses_completed', NULL),

-- Quiz Performance Badges
('Quiz Champion', 'Score 90% or higher in 5 quizzes', '🏆', 'quiz_performance', 'high_scores', 5),
('Perfect Score', 'Get 100% in any quiz', '💯', 'quiz_performance', 'perfect_score', 1),
('Consistent Learner', 'Complete 10 quizzes with 80% or higher score', '📝', 'quiz_performance', 'consistent_scores', 10); 