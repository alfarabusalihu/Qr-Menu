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
	GetOrders(ctx context.Context) ([]models.Order, error)
	UpdateOrderStatus(ctx context.Context, id string, status string) error
	GetMenuItem(ctx context.Context, id string) (*models.MenuItem, error)
	UpdateMenuItemStock(ctx context.Context, id string, stock int) error
	ToggleMenuItemAvailability(ctx context.Context, id string, isAvailable bool) error
	
	// Product Management
	CreateProduct(ctx context.Context, item *models.MenuItem, categoryID string) error
	UpdateProduct(ctx context.Context, item *models.MenuItem) error
	DeleteProduct(ctx context.Context, id string) error
	CreateCategory(ctx context.Context, name string) error

	// Staff Management
	GetStaffByEmail(ctx context.Context, email string) (*models.Staff, error)
	CreateStaffSession(ctx context.Context, staffID string) (string, error)
	EndStaffSession(ctx context.Context, sessionID string) error
	GetActiveStaff(ctx context.Context) ([]models.Staff, error)
	GetAllStaff(ctx context.Context) ([]models.Staff, error)
	CreateStaff(ctx context.Context, staff *models.Staff, passwordHash string) error
}

func (r *PostgresRepository) CreateStaff(ctx context.Context, staff *models.Staff, passwordHash string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO staff (name, email, password_hash, role, job_title, is_active)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, staff.Name, staff.Email, passwordHash, staff.Role, staff.JobTitle, staff.IsActive)
	return err
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
	r.EnsureTodayInventory(ctx)
	
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

		_, err = tx.Exec(ctx, `
			UPDATE daily_inventory
			SET current_stock = current_stock - $1,
				updated_at = NOW()
			WHERE menu_item_id = $2::uuid AND date = CURRENT_DATE
		`, item.Quantity, item.ID)

		if err != nil {
			return err
		}

		_, err = tx.Exec(ctx, `
			UPDATE menu_items m
			SET is_available = false
			WHERE m.id = $1::uuid
			AND (SELECT current_stock FROM daily_inventory 
				 WHERE menu_item_id = $1::uuid AND date = CURRENT_DATE) <= 0
		`, item.ID)

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

func (r *PostgresRepository) CreateStaffSession(ctx context.Context, staffID string) (string, error) {
	var sessionID string
	err := r.db.QueryRow(ctx, `
		INSERT INTO staff_sessions (staff_id)
		VALUES ($1::uuid)
		RETURNING id::text
	`, staffID).Scan(&sessionID)
	return sessionID, err
}

func (r *PostgresRepository) EndStaffSession(ctx context.Context, sessionID string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE staff_sessions
		SET logout_at = NOW(), is_active = false
		WHERE id = $1::uuid
	`, sessionID)
	return err
}

func (r *PostgresRepository) GetActiveStaff(ctx context.Context) ([]models.Staff, error) {
	rows, err := r.db.Query(ctx, `
		SELECT DISTINCT s.id::text, s.name, s.email, s.role, s.is_active, s.created_at
		FROM staff s
		INNER JOIN staff_sessions ss ON s.id = ss.staff_id
		WHERE ss.is_active = true AND s.is_active = true
		ORDER BY s.name
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var staffList []models.Staff
	for rows.Next() {
		var staff models.Staff
		if err := rows.Scan(&staff.ID, &staff.Name, &staff.Email, &staff.Role, &staff.IsActive, &staff.CreatedAt); err != nil {
			return nil, err
		}
		staffList = append(staffList, staff)
	}
	return staffList, nil
}

func (r *PostgresRepository) GetAllStaff(ctx context.Context) ([]models.Staff, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id::text, name, email, role, job_title, is_active, created_at
		FROM staff
		WHERE is_active = true
		ORDER BY name
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var staffList []models.Staff
	for rows.Next() {
		var staff models.Staff
		var jobTitle *string
		if err := rows.Scan(&staff.ID, &staff.Name, &staff.Email, &staff.Role, &jobTitle, &staff.IsActive, &staff.CreatedAt); err != nil {
			return nil, err
		}
		if jobTitle != nil {
			staff.JobTitle = *jobTitle
		}
		staffList = append(staffList, staff)
	}
	return staffList, nil
}

func (r *PostgresRepository) GetStaffByEmail(ctx context.Context, email string) (*models.Staff, error) {
	var staff models.Staff
	var jobTitle *string
	err := r.db.QueryRow(ctx, `
		SELECT id::text, name, email, password_hash, role, job_title, is_active, created_at
		FROM staff
		WHERE email = $1 AND is_active = true
	`, email).Scan(&staff.ID, &staff.Name, &staff.Email, &staff.PasswordHash, &staff.Role, &jobTitle, &staff.IsActive, &staff.CreatedAt)
	if err != nil {
		return nil, err
	}
	if jobTitle != nil {
		staff.JobTitle = *jobTitle
	}
	return &staff, nil
}

func (r *PostgresRepository) EnsureTodayInventory(ctx context.Context) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO daily_inventory (menu_item_id, date, initial_stock, current_stock)
		SELECT id, CURRENT_DATE, available_qty, available_qty
		FROM menu_items
		ON CONFLICT (menu_item_id, date) DO NOTHING
	`)
	return err
}

func (r *PostgresRepository) GetMenuWithStock(ctx context.Context) (*models.MenuData, error) {
	r.EnsureTodayInventory(ctx)

	query := `
		SELECT 
			c.id::text, c.name,
			m.id::text, m.name, m.description, m.price, m.image_url, m.prep_time, 
			m.available_qty, m.is_available,
			COALESCE(di.current_stock, m.available_qty) as current_stock
		FROM categories c
		LEFT JOIN menu_items m ON c.id = m.category_id
		LEFT JOIN daily_inventory di ON m.id = di.menu_item_id AND di.date = CURRENT_DATE
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
		var mQty, currentStock *int
		var isAvailable *bool

		if err := rows.Scan(&catID, &catName, &mID, &mName, &mDesc, &mPrice, &mImg, &mTime, &mQty, &isAvailable, &currentStock); err != nil {
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
				AvailableQty: *currentStock,
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

func (r *PostgresRepository) ToggleMenuItemAvailability(ctx context.Context, itemID string, isAvailable bool) error {
	_, err := r.db.Exec(ctx, `
		UPDATE menu_items
		SET is_available = $1
		WHERE id = $2::uuid
	`, isAvailable, itemID)
	return err
}

func (r *PostgresRepository) UpdateDailyStock(ctx context.Context, itemID string, quantity int) error {
	_, err := r.db.Exec(ctx, `
		UPDATE daily_inventory
		SET current_stock = current_stock - $1,
			updated_at = NOW()
		WHERE menu_item_id = $2::uuid AND date = CURRENT_DATE
	`, quantity, itemID)
	
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx, `
		UPDATE menu_items m
		SET is_available = false
		WHERE m.id = $1::uuid
		AND (SELECT current_stock FROM daily_inventory 
			 WHERE menu_item_id = $1::uuid AND date = CURRENT_DATE) <= 0
	`, itemID)
	
	return err
}

func (r *PostgresRepository) GetOrdersForStaff(ctx context.Context, status string) ([]models.Order, error) {
	query := `
		SELECT id::text, session_id, table_id, cust_name, cust_phone, cust_email,
			payment_method, payment_status, status, total_amount, created_at
		FROM orders
	`
	
	args := []interface{}{}
	if status != "" {
		query += " WHERE status = $1"
		args = append(args, status)
	}
	
	query += " ORDER BY created_at ASC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var order models.Order
		var custName, custPhone, custEmail *string

		err := rows.Scan(&order.ID, &order.SessionID, &order.TableID, &custName, &custPhone, &custEmail,
			&order.PaymentMethod, &order.PaymentStatus, &order.Status, &order.Total, &order.CreatedAt)
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

		orders = append(orders, order)
	}

	return orders, nil
}

func (r *PostgresRepository) UpdateOrderStatus(ctx context.Context, orderID string, status string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE orders
		SET status = $1
		WHERE id = $2::uuid
	`, status, orderID)
	return err
}

func (r *PostgresRepository) CreateProduct(ctx context.Context, item *models.MenuItem, categoryID string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO menu_items (id, category_id, name, description, price, image_url, prep_time, available_qty, is_available) 
		VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9)
	`, item.ID, categoryID, item.Name, item.Description, item.Price, item.Image, item.PrepTime, item.AvailableQty, item.IsAvailable)
	return err
}

func (r *PostgresRepository) UpdateProduct(ctx context.Context, item *models.MenuItem) error {
	_, err := r.db.Exec(ctx, `
		UPDATE menu_items 
		SET name=$1, description=$2, price=$3, image_url=$4, prep_time=$5, available_qty=$6, is_available=$7 
		WHERE id=$8::uuid
	`, item.Name, item.Description, item.Price, item.Image, item.PrepTime, item.AvailableQty, item.IsAvailable, item.ID)
	return err
}

func (r *PostgresRepository) DeleteProduct(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM menu_items WHERE id = $1::uuid", id)
	return err
}

func (r *PostgresRepository) CreateCategory(ctx context.Context, name string) error {
	slug := name // simple slug for now
	_, err := r.db.Exec(ctx, "INSERT INTO categories (name, slug) VALUES ($1, $2)", name, slug)
	return err
}

func (r *PostgresRepository) GetOrders(ctx context.Context) ([]models.Order, error) {
	return r.GetOrdersForStaff(ctx, "")
}

func (r *PostgresRepository) GetMenuItem(ctx context.Context, id string) (*models.MenuItem, error) {
	var item models.MenuItem
	err := r.db.QueryRow(ctx, `
		SELECT id::text, name, description, price, image_url, prep_time, available_qty, is_available
		FROM menu_items WHERE id = $1::uuid
	`, id).Scan(&item.ID, &item.Name, &item.Description, &item.Price, &item.Image, &item.PrepTime, &item.AvailableQty, &item.IsAvailable)
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *PostgresRepository) UpdateMenuItemStock(ctx context.Context, id string, stock int) error {
	return nil
}
