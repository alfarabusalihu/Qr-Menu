package main

import (
	"log"
	"menu-backend/internal/database"
	"menu-backend/internal/handlers"
	"menu-backend/internal/repository"
	"menu-backend/internal/service"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	dbPool, err := database.New(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer dbPool.Close()

	repo := repository.NewPostgresRepository(dbPool)
	svc := service.NewMenuService(repo)
	handler := handlers.NewHandler(svc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/menu", handler.GetMenu)
	mux.HandleFunc("POST /api/orders", handler.CreateOrder)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
