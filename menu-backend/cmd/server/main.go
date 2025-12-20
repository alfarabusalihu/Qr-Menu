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
	staffHandler := handlers.NewStaffHandler(repo)

	mux := http.NewServeMux()
	
	mux.HandleFunc("GET /api/menu", handler.GetMenu)
	mux.HandleFunc("POST /api/orders", handler.CreateOrder)
	
	mux.HandleFunc("POST /api/staff/login", staffHandler.Login)
	mux.HandleFunc("POST /api/staff/register", staffHandler.Register)
	mux.HandleFunc("POST /api/staff/logout", staffHandler.Logout)
	mux.HandleFunc("GET /api/staff/active", staffHandler.GetActiveStaff)
	mux.HandleFunc("GET /api/staff/list", staffHandler.GetAllStaff)
	mux.HandleFunc("GET /api/staff/orders", staffHandler.GetOrders)
	mux.HandleFunc("PUT /api/staff/orders/{id}/status", staffHandler.UpdateOrderStatus)
	mux.HandleFunc("GET /api/staff/menu", staffHandler.GetMenuWithStock)
	mux.HandleFunc("PUT /api/staff/menu/{id}/toggle", staffHandler.ToggleItemAvailability)
	mux.HandleFunc("POST /api/products", staffHandler.CreateProduct)
	mux.HandleFunc("PUT /api/products/{id}", staffHandler.UpdateProduct)
	mux.HandleFunc("DELETE /api/products/{id}", staffHandler.DeleteProduct)

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
