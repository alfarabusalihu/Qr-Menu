package service

import (
	"errors"
	"menu-backend/internal/models"
	"menu-backend/internal/repository"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	Repo *repository.Repo
}

func NewService(repo *repository.Repo) *Service {
	return &Service{Repo: repo}
}

func (s *Service) GetAllProducts() ([]models.Product, error) {
	return s.Repo.GetAllProducts()
}

func (s *Service) AppAddProduct(p *models.Product) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	if p.ImageURL == "" {
		p.ImageURL = "https://via.placeholder.com/150"
	}
	return s.Repo.CreateProduct(p)
}

func (s *Service) AppUpdateProduct(p *models.Product) error {
	return s.Repo.UpdateProduct(p)
}

func (s *Service) AppDeleteProduct(id string) error {
	return s.Repo.DeleteProduct(id)
}

func (s *Service) AppToggleProduct(id string) error {
	return s.Repo.ToggleProductAvailability(id)
}

func (s *Service) Login(email, password string) (*models.User, string, error) {
	user, err := s.Repo.GetUserByEmail(email)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, "", errors.New("invalid password")
	}

	return user, "mock-token-123", nil
}

func (s *Service) RegisterStaff(name, email, password, jobTitle string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		ID:           uuid.New().String(),
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Role:         "staff",
		JobTitle:     jobTitle,
	}

	return s.Repo.CreateUser(user)
}
