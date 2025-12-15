package service

import (
	"context"
	"menu-backend/internal/models"
	"menu-backend/internal/repository"
)

type Service interface {
	GetMenu(ctx context.Context) (*models.MenuData, error)
	PlaceOrder(ctx context.Context, order *models.Order) (*models.Order, error)
	GetOrder(ctx context.Context, id string) (*models.Order, error)
}

type MenuService struct {
	repo repository.Repository
}

func NewMenuService(repo repository.Repository) *MenuService {
	return &MenuService{repo: repo}
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
	return order, nil
}

func (s *MenuService) GetOrder(ctx context.Context, id string) (*models.Order, error) {
	return s.repo.GetOrder(ctx, id)
}
