package handlers

import (
	"encoding/json"
	"menu-backend/internal/models"
	"menu-backend/internal/repository"
	"menu-backend/internal/service"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type Handler struct {
	service service.Service
}

func NewHandler(s service.Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetMenu(w http.ResponseWriter, r *http.Request) {
	menu, err := h.service.GetMenu(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(menu)
}

func (h *Handler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	var order models.Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	createdOrder, err := h.service.PlaceOrder(r.Context(), &order)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdOrder)
}

type StaffHandler struct {
	repo *repository.PostgresRepository
}

func NewStaffHandler(repo *repository.PostgresRepository) *StaffHandler {
	return &StaffHandler{repo: repo}
}

func (h *StaffHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.StaffLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	staff, err := h.repo.GetStaffByEmail(r.Context(), req.Email)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(staff.PasswordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	sessionID, err := h.repo.CreateStaffSession(r.Context(), staff.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.StaffLoginResponse{
		Token: sessionID,
		Staff: *staff,
	})
}

func (h *StaffHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		JobTitle string `json:"jobTitle"` // Optional, default to waiter
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to process password", http.StatusInternalServerError)
		return
	}

	// Create staff
	staff := &models.Staff{
		Name:         req.Name,
		Email:        req.Email,
		Role:         "staff", // Default role
		JobTitle:     req.JobTitle,
		IsActive:     true,
	}
	if staff.JobTitle == "" {
		staff.JobTitle = "waiter"
	}
	// We need a helper to insert with password hash, not just "CreateStaff" which might not exist in that form
	// I'll add CreateStaffWithPassword to repository
	if err := h.repo.CreateStaff(r.Context(), staff, string(hashedPwd)); err != nil {
		http.Error(w, "Failed to register: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *StaffHandler) Logout(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Header.Get("Authorization")
	if sessionID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if err := h.repo.EndStaffSession(r.Context(), sessionID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *StaffHandler) GetActiveStaff(w http.ResponseWriter, r *http.Request) {
	staff, err := h.repo.GetActiveStaff(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(staff)
}

func (h *StaffHandler) GetAllStaff(w http.ResponseWriter, r *http.Request) {
	staff, err := h.repo.GetAllStaff(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(staff)
}

func (h *StaffHandler) GetOrders(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	
	orders, err := h.repo.GetOrdersForStaff(r.Context(), status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func (h *StaffHandler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	orderID := r.PathValue("id")
	
	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.UpdateOrderStatus(r.Context(), orderID, req.Status); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *StaffHandler) GetMenuWithStock(w http.ResponseWriter, r *http.Request) {
	menu, err := h.repo.GetMenuWithStock(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(menu)
}

func (h *StaffHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name         string  `json:"name"`
		Description  string  `json:"description"`
		Price        float64 `json:"price"`
		Image        string  `json:"image"`
		PrepTime     string  `json:"prepTime"`
		AvailableQty int     `json:"availableQty"`
		IsAvailable  bool    `json:"isAvailable"`
		CategoryID   string  `json:"categoryId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	item := &models.MenuItem{
		ID:           "", // UUID gen by DB
		Name:         req.Name,
		Description:  req.Description,
		Price:        req.Price,
		Image:        req.Image,
		PrepTime:     req.PrepTime,
		AvailableQty: req.AvailableQty,
		IsAvailable:  req.IsAvailable,
	}

	if err := h.repo.CreateProduct(r.Context(), item, req.CategoryID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *StaffHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req models.MenuItem
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	req.ID = id
	if err := h.repo.UpdateProduct(r.Context(), &req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *StaffHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.repo.DeleteProduct(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *StaffHandler) ToggleItemAvailability(w http.ResponseWriter, r *http.Request) {
	itemID := r.PathValue("id")
	
	// Check current status
	item, err := h.repo.GetMenuItem(r.Context(), itemID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Toggle
	if err := h.repo.ToggleMenuItemAvailability(r.Context(), itemID, !item.IsAvailable); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
