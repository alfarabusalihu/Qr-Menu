-- Seed data for staff (password is 'password123' hashed with bcrypt)
INSERT INTO staff (id, name, email, password_hash, role) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Admin User', 'admin@themenu.com', '$2a$10$rZ7qGx8qN5YqN5YqN5YqNOqN5YqN5YqN5YqN5YqN5YqN5YqN5YqNO', 'admin'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'John Smith', 'john@themenu.com', '$2a$10$rZ7qGx8qN5YqN5YqN5YqNOqN5YqN5YqN5YqN5YqN5YqN5YqN5YqNO', 'staff'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Sarah Johnson', 'sarah@themenu.com', '$2a$10$rZ7qGx8qN5YqN5YqN5YqNOqN5YqN5YqN5YqN5YqN5YqN5YqN5YqNO', 'staff');

-- Initialize today's inventory for all menu items
INSERT INTO daily_inventory (menu_item_id, date, initial_stock, current_stock)
SELECT id, CURRENT_DATE, available_qty, available_qty
FROM menu_items
ON CONFLICT (menu_item_id, date) DO NOTHING;
