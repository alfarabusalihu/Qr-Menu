package handlers

import (
	"encoding/json"
	"menu-backend/internal/models"
	"menu-backend/internal/service"
	"net/http"

	"github.com/gorilla/mux"
)

type Handler struct {
	Service *service.Service
}

func NewHandler(s *service.Service) *Handler {
	return &Handler{Service: s}
}

func (h *Handler) GetMenu(w http.ResponseWriter, r *http.Request) {
	products, err := h.Service.GetAllProducts()
	if err != nil {
		http.Error(w, "Failed to fetch menu", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"categories": []map[string]interface{}{
			{
				"id":    "all",
				"name":  "All Products",
				"items": products,
			},
		},
	})
}

func (h *Handler) AddProduct(w http.ResponseWriter, r *http.Request) {
	var p models.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.Service.AppAddProduct(&p); err != nil {
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var p models.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	p.ID = id

	if err := h.Service.AppUpdateProduct(&p); err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := h.Service.AppDeleteProduct(id); err != nil {
		http.Error(w, "Failed to delete product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) ToggleProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := h.Service.AppToggleProduct(id); err != nil {
		http.Error(w, "Failed to toggle product", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	user, token, err := h.Service.Login(creds.Email, creds.Password)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"staff": user,
	})
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		JobTitle string `json:"jobTitle"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.Service.RegisterStaff(input.Name, input.Email, input.Password, input.JobTitle); err != nil {
		http.Error(w, "Failed to register", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
