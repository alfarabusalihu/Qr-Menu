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
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var orderID string
	err = tx.QueryRow(ctx, `
		INSERT INTO orders (session_id, table_id, cust_name, cust_phone, cust_email, 
			payment_method, payment_status, stripe_session_id, status, total_amount)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id::text
	`, order.SessionID, order.TableID, order.UserDetails.Name, order.UserDetails.Phone,
		order.UserDetails.Email, order.PaymentMethod, order.PaymentStatus,
		order.StripeSessionID, order.Status, order.Total).Scan(&orderID)

	if err != nil {
		return err
	}

	order.ID = orderID

	for _, item := range order.Items {
		_, err = tx.Exec(ctx, `
			INSERT INTO order_items (order_id, menu_item_id, name, quantity, price)
			VALUES ($1, $2::uuid, $3, $4, $5)
		`, orderID, item.ID, item.Name, item.Quantity, item.Price)

		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func (r *PostgresRepository) GetOrder(ctx context.Context, id string) (*models.Order, error) {
	var order models.Order
	var custName, custPhone, custEmail, stripeSessionID *string

	err := r.db.QueryRow(ctx, `
		SELECT id::text, session_id, table_id, cust_name, cust_phone, cust_email,
			payment_method, payment_status, stripe_session_id, status, total_amount, created_at
		FROM orders WHERE id = $1::uuid
	`, id).Scan(&order.ID, &order.SessionID, &order.TableID, &custName, &custPhone, &custEmail,
		&order.PaymentMethod, &order.PaymentStatus, &stripeSessionID, &order.Status,
		&order.Total, &order.CreatedAt)

	if err != nil {
		return nil, err
	}

	if custName != nil {
		order.UserDetails.Name = *custName
	}
	if custPhone != nil {
		order.UserDetails.Phone = *custPhone
	}
	if custEmail != nil {
		order.UserDetails.Email = *custEmail
	}
	if stripeSessionID != nil {
		order.StripeSessionID = *stripeSessionID
	}

	rows, err := r.db.Query(ctx, `
		SELECT menu_item_id::text, name, quantity, price
		FROM order_items WHERE order_id = $1::uuid
	`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	order.Items = []models.CartItem{}
	for rows.Next() {
		var item models.CartItem
		if err := rows.Scan(&item.ID, &item.Name, &item.Quantity, &item.Price); err != nil {
			return nil, err
		}
		order.Items = append(order.Items, item)
	}

	return &order, nil
}

func (r *PostgresRepository) GetOrdersBySession(ctx context.Context, sessionID string) ([]models.Order, error) {
	return []models.Order{}, nil
}
