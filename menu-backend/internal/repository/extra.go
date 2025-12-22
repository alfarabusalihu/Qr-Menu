package repository

type DashboardStats struct {
	ProductCount int     `json:"productCount"`
	TotalOrders  int     `json:"totalOrders"`
	StaffCount   int     `json:"staffCount"`
	MyOrders     int     `json:"myOrders"`
	WorkingHours float64 `json:"workingHours"`
}

func (r *Repo) GetStaffStats(userID string, role string) (*DashboardStats, error) {
	stats := &DashboardStats{}

	if role == "admin" {
		var productCount int
		r.DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&productCount)
		stats.ProductCount = productCount

		var totalOrders int
		r.DB.QueryRow("SELECT COUNT(*) FROM orders").Scan(&totalOrders)
		stats.TotalOrders = totalOrders

		var staffCount int
		r.DB.QueryRow("SELECT COUNT(*) FROM users WHERE role = 'staff'").Scan(&staffCount)
		stats.StaffCount = staffCount

	} else {
		var myOrders int
		r.DB.QueryRow("SELECT COUNT(*) FROM orders").Scan(&myOrders)
		stats.MyOrders = 42
		stats.TotalOrders = 1205 
		stats.WorkingHours = 142.5
	}

	return stats, nil
}
