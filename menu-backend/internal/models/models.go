package models

import "time"

type MenuData struct {
	RestaurantName string     `json:"restaurantName"`
	Categories     []Category `json:"categories"`
}

type Category struct {
	ID    string     `json:"id"`
	Name  string     `json:"name"`
	Items []MenuItem `json:"items"`
}

type MenuItem struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Price        float64  `json:"price"`
	Image        string   `json:"image"`
	PrepTime     string   `json:"prepTime"`
	AvailableQty int      `json:"availableQty"`
	IsAvailable  bool     `json:"isAvailable"`
	Addons       []string `json:"addons,omitempty"`
}

type UserDetails struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type CartItem struct {
	MenuItem
	Quantity int `json:"quantity"`
}

type Order struct {
	ID              string      `json:"id"`
	SessionID       string      `json:"sessionId"`
	TableID         string      `json:"tableId"`
	UserDetails     UserDetails `json:"userDetails"`
	PaymentMethod   string      `json:"paymentMethod"`
	PaymentStatus   string      `json:"paymentStatus"`
	StripeSessionID string      `json:"stripeSessionId,omitempty"`
	Status          string      `json:"status"`
	Items           []CartItem  `json:"items"`
	Total           float64     `json:"total"`
	CreatedAt       time.Time   `json:"createdAt"`
}

type Staff struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	JobTitle     string    `json:"jobTitle"`
	IsActive     bool      `json:"isActive"`
	Phone        string    `json:"phone,omitempty"`
	JoinedAt     time.Time `json:"joinedAt"`
	CreatedAt    time.Time `json:"createdAt"`
}

type BusinessSettings struct {
	ID           string `json:"id"`
	BusinessName string `json:"businessName"`
	Currency     string `json:"currency"`
}

type StaffSession struct {
	ID       string     `json:"id"`
	StaffID  string     `json:"staffId"`
	LoginAt  time.Time  `json:"loginAt"`
	LogoutAt *time.Time `json:"logoutAt,omitempty"`
	IsActive bool       `json:"isActive"`
}

type DailyInventory struct {
	ID           string    `json:"id"`
	MenuItemID   string    `json:"menuItemId"`
	Date         string    `json:"date"`
	InitialStock int       `json:"initialStock"`
	CurrentStock int       `json:"currentStock"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type StaffLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type StaffLoginResponse struct {
	Token string `json:"token"`
	Staff Staff  `json:"staff"`
}

type MenuItemWithStock struct {
	MenuItem
	DailyLimit   int  `json:"dailyLimit"`
	CurrentStock int  `json:"currentStock"`
	IsLowStock   bool `json:"isLowStock"`
}
