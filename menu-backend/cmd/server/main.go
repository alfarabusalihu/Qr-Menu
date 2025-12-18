package main

import (
	"log"
	"menu-backend/internal/database"
	"menu-backend/internal/handlers"
	"menu-backend/internal/repository"
	"menu-backend/internal/service"
	"menu-backend/internal/middlewares"

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
	notifier := service.NewWhatsAppNotificationService()
	svc := service.NewMenuService(repo, notifier)
	handler := handlers.NewHandler(svc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/menu", handler.GetMenu)
	mux.HandleFunc("POST /api/orders", handler.CreateOrder)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	handlerWithCORS := middlewares.CORS(mux)

	if err := http.ListenAndServe(":"+port, handlerWithCORS); err != nil {
		log.Fatal(err)
	}

}
