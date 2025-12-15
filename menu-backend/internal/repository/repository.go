package repository

import (
	"context"
	"menu-backend/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	GetMenu(ctx context.Context) (*models.MenuData, error)
	CreateOrder(ctx context.Context, order *models.Order) error
	GetOrder(ctx context.Context, id string) (*models.Order, error)
	GetOrdersBySession(ctx context.Context, sessionID string) ([]models.Order, error)
}

type PostgresRepository struct {
	db *pgxpool.Pool
}

func NewPostgresRepository(db *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{db: db}
}

func (r *PostgresRepository) GetMenu(ctx context.Context) (*models.MenuData, error) {
	query := `
		SELECT 
			c.id::text, c.name,
			m.id::text, m.name, m.description, m.price, m.image_url, m.prep_time, m.available_qty
		FROM categories c
		LEFT JOIN menu_items m ON c.id = m.category_id
		ORDER BY c.display_order, m.name
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	catMap := make(map[string]*models.Category)
	var catList []*models.Category

	for rows.Next() {
		var catID, catName string
		var mID, mName, mDesc, mImg, mTime *string
		var mPrice *float64
		var mQty *int

		if err := rows.Scan(&catID, &catName, &mID, &mName, &mDesc, &mPrice, &mImg, &mTime, &mQty); err != nil {
			return nil, err
		}

		if _, exists := catMap[catID]; !exists {
			newCat := &models.Category{
				ID:    catID,
				Name:  catName,
				Items: []models.MenuItem{},
			}
			catMap[catID] = newCat
			catList = append(catList, newCat)
		}

		if mID != nil {
			item := models.MenuItem{
				ID:           *mID,
				Name:         *mName,
				Description:  *mDesc,
				Price:        *mPrice,
				Image:        *mImg,
				PrepTime:     *mTime,
				AvailableQty: *mQty,
			}
			catMap[catID].Items = append(catMap[catID].Items, item)
		}
	}

	finalCats := make([]models.Category, len(catList))
	for i, c := range catList {
		finalCats[i] = *c
	}
	
	return &models.MenuData{
		RestaurantName: "My Restaurant", 
		Categories:     finalCats,
	}, nil
}

func (r *PostgresRepository) CreateOrder(ctx context.Context, order *models.Order) error {
	return nil
}

func (r *PostgresRepository) GetOrder(ctx context.Context, id string) (*models.Order, error) {
	return &models.Order{}, nil
}

func (r *PostgresRepository) GetOrdersBySession(ctx context.Context, sessionID string) ([]models.Order, error) {
	return []models.Order{}, nil
}
