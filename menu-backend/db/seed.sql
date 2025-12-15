-- Clear existing data
TRUNCATE table order_items, orders, menu_items, categories CASCADE;

-- Insert Categories
INSERT INTO categories (id, slug, name, display_order) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'starters', 'Starters', 1),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'mains', 'Main Courses', 2),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'drinks', 'Drinks', 3);

-- Insert Items: Starters
INSERT INTO menu_items (category_id, name, description, price, image_url, prep_time, available_qty) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Garlic Bread', 'Toasted french baguette with garlic butter', 4.50, 'https://images.unsplash.com/photo-1573140247632-f84660f67126', '10 mins', 50),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bruschetta', 'Grilled bread rubbed with garlic and topped with olive oil and salt', 5.50, 'https://images.unsplash.com/photo-1572695157363-bc31c5d531bb', '12 mins', 40);

-- Insert Items: Mains
INSERT INTO menu_items (category_id, name, description, price, image_url, prep_time, available_qty) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Classic Burger', 'Beef patty with lettuce, tomato, and cheese', 12.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', '20 mins', 30),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Margherita Pizza', 'Classic tomato and mozzarella pizza', 10.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', '25 mins', 25);

-- Insert Items: Drinks
INSERT INTO menu_items (category_id, name, description, price, image_url, prep_time, available_qty) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Coke', 'Chilled Coca-Cola', 2.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', '2 mins', 100),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Orange Juice', 'Freshly squeezed orange juice', 3.50, 'https://images.unsplash.com/photo-1613478223719-2ab802602423', '5 mins', 50);
