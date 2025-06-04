package main

import (
	"defenzo/config"
	"defenzo/routes"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Set up logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("Starting backend server...")

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	} else {
		log.Println("Successfully loaded .env file")
	}

	// Initialize database
	config.InitDB()
	config.MigrateDB()

	// Create router
	r := mux.NewRouter()
	log.Println("Router created")

	// Setup routes
	routes.SetupRoutes(r)
	log.Println("Routes configured")

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Accept"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum age for browser to cache the response
	})
	log.Println("CORS configured")

	// Create server with CORS middleware
	handler := c.Handler(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
