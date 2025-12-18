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
