package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"menu-backend/internal/models"
)

type Repo struct {
	DB *sql.DB
}

func NewRepo(db *sql.DB) *Repo {
	return &Repo{DB: db}
}

func (r *Repo) GetAllProducts() ([]models.Product, error) {
	rows, err := r.DB.Query("SELECT id, name, description, price, image_url, prep_time, stock_qty, is_available, category_id FROM products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.ImageURL, &p.PrepTime, &p.StockQty, &p.IsAvailable, &p.CategoryID); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}

func (r *Repo) CreateProduct(p *models.Product) error {
	_, err := r.DB.Exec("INSERT INTO products (id, name, description, price, image_url, prep_time, stock_qty, is_available, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		p.ID, p.Name, p.Description, p.Price, p.ImageURL, p.PrepTime, p.StockQty, p.IsAvailable, p.CategoryID)
	return err
}

func (r *Repo) UpdateProduct(p *models.Product) error {
	_, err := r.DB.Exec("UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, prep_time=$5, stock_qty=$6, is_available=$7, category_id=$8 WHERE id=$9",
		p.Name, p.Description, p.Price, p.ImageURL, p.PrepTime, p.StockQty, p.IsAvailable, p.CategoryID, p.ID)
	return err
}

func (r *Repo) DeleteProduct(id string) error {
	_, err := r.DB.Exec("DELETE FROM products WHERE id=$1", id)
	return err
}

func (r *Repo) ToggleProductAvailability(id string) error {
	_, err := r.DB.Exec("UPDATE products SET is_available = NOT is_available WHERE id=$1", id)
	return err
}

func (r *Repo) GetUserByEmail(email string) (*models.User, error) {
	var u models.User
	err := r.DB.QueryRow("SELECT id, name, email, password_hash, role, job_title FROM users WHERE email=$1", email).
		Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.JobTitle)
	if err == sql.ErrNoRows {
		return nil, nil 
	}
	return &u, err
}

func (r *Repo) CreateUser(u *models.User) error {
	_, err := r.DB.Exec("INSERT INTO users (id, name, email, password_hash, role, job_title) VALUES ($1, $2, $3, $4, $5, $6)",
		u.ID, u.Name, u.Email, u.PasswordHash, u.Role, u.JobTitle)
	return err
}

func (r *Repo) GetAllStaff() ([]models.User, error) {
	rows, err := r.DB.Query("SELECT id, name, email, role, job_title FROM users WHERE role = 'staff'")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var staff []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.JobTitle); err != nil {
			return nil, err
		}
		staff = append(staff, u)
	}
	return staff, nil
}

func (r *Repo) GetSettings() (*models.Settings, error) {
    return &models.Settings{
        BusinessName: "My Restaurant", 
        Currency: "USD",
    }, nil
}

func (r *Repo) UpdateSettings(s *models.Settings) error {
    return nil
}

func (r *Repo) GetOrders() ([]models.Order, error) {
	// Mock implementation or real DB fetch
	return []models.Order{}, nil
}

func (r *Repo) UpdateOrderStatus(id string, status string) error {
	return nil
}
