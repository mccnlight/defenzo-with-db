package routes

import (
	"net/http"

	"defenzo/handlers"
	"defenzo/middleware"

	"github.com/gorilla/mux"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *mux.Router) {
	// Public routes
	r.HandleFunc("/api/register", handlers.Register).Methods("POST")
	r.HandleFunc("/api/login", handlers.Login).Methods("POST")

	// Security tools
	r.HandleFunc("/api/scan", handlers.ScanURL).Methods("POST")
	r.HandleFunc("/api/password-check", handlers.CheckPassword).Methods("POST")

	// Protected routes
	r.HandleFunc("/api/profile", middleware.AuthMiddleware(handlers.GetProfile)).Methods("GET")
	r.HandleFunc("/api/profile/picture", middleware.AuthMiddleware(handlers.UploadProfilePicture)).Methods("POST")

	// Course routes
	r.HandleFunc("/api/courses", handlers.GetCourses).Methods("GET")
	r.HandleFunc("/api/courses/{id}", handlers.GetCourseByID).Methods("GET")

	// Progress routes
	r.HandleFunc("/api/user/progress", middleware.AuthMiddleware(handlers.GetUserProgress)).Methods("GET")
	r.HandleFunc("/api/user/progress", middleware.AuthMiddleware(handlers.UpdateUserProgress)).Methods("POST")

	// Badge routes
	r.HandleFunc("/api/user/badges", middleware.AuthMiddleware(handlers.GetUserBadges)).Methods("GET")
	r.HandleFunc("/api/user/badges/progress", middleware.AuthMiddleware(handlers.UpdateBadgeProgress)).Methods("POST")
	r.HandleFunc("/api/user/badges/check", middleware.AuthMiddleware(handlers.CheckAndAwardBadges)).Methods("POST")

	// Serve static files
	fs := http.FileServer(http.Dir("uploads"))
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", fs))
}
