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
