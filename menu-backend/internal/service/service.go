package service

import (
	"context"
	"log"
	"menu-backend/internal/models"
	"menu-backend/internal/repository"
)

type Service interface {
	GetMenu(ctx context.Context) (*models.MenuData, error)
	PlaceOrder(ctx context.Context, order *models.Order) (*models.Order, error)
	GetOrder(ctx context.Context, id string) (*models.Order, error)
	
	// Product Management
	CreateProduct(ctx context.Context, item *models.MenuItem, categoryID string) error
	UpdateProduct(ctx context.Context, item *models.MenuItem) error
	DeleteProduct(ctx context.Context, id string) error
	ToggleItemAvailability(ctx context.Context, id string) error
	CreateCategory(ctx context.Context, name string) error

	// Staff Management
	GetActiveStaff(ctx context.Context) ([]models.Staff, error)
	GetAllStaff(ctx context.Context) ([]models.Staff, error)
}

type MenuService struct {
	repo     repository.Repository
	notifier NotificationService
}

func NewMenuService(repo repository.Repository, notifier NotificationService) *MenuService {
	return &MenuService{
		repo:     repo,
		notifier: notifier,
	}
}

func (s *MenuService) GetMenu(ctx context.Context) (*models.MenuData, error) {
	return s.repo.GetMenu(ctx)
}

func (s *MenuService) PlaceOrder(ctx context.Context, order *models.Order) (*models.Order, error) {
	order.Status = "pending"
	order.PaymentStatus = "pending"
	err := s.repo.CreateOrder(ctx, order)
	if err != nil {
		return nil, err
	}

	go func() {
		if err := s.notifier.SendOrderConfirmation(order); err != nil {
			log.Printf("[ERROR] Failed to send notification: %v", err)
		}
	}()

	return order, nil
}

func (s *MenuService) GetOrder(ctx context.Context, id string) (*models.Order, error) {
	return s.repo.GetOrder(ctx, id)
}

// Product Management

func (s *MenuService) CreateProduct(ctx context.Context, item *models.MenuItem, categoryID string) error {
	return s.repo.CreateProduct(ctx, item, categoryID)
}

func (s *MenuService) UpdateProduct(ctx context.Context, item *models.MenuItem) error {
	return s.repo.UpdateProduct(ctx, item)
}

func (s *MenuService) DeleteProduct(ctx context.Context, id string) error {
	return s.repo.DeleteProduct(ctx, id)
}

func (s *MenuService) ToggleItemAvailability(ctx context.Context, id string) error {
	item, err := s.repo.GetMenuItem(ctx, id)
	if err != nil {
		return err
	}
	// Toggle
	return s.repo.ToggleMenuItemAvailability(ctx, id, !item.IsAvailable)
}

func (s *MenuService) CreateCategory(ctx context.Context, name string) error {
	return s.repo.CreateCategory(ctx, name)
}

// Staff Management

func (s *MenuService) GetActiveStaff(ctx context.Context) ([]models.Staff, error) {
	return s.repo.GetActiveStaff(ctx)
}

func (s *MenuService) GetAllStaff(ctx context.Context) ([]models.Staff, error) {
	return s.repo.GetAllStaff(ctx)
}

