
-- Users table matching models.User
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    name VARCHAR,
    hashed_password VARCHAR
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_id ON users(id);

-- Products table matching models.Product
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    price FLOAT,
    description VARCHAR,
    image VARCHAR,
    category VARCHAR
);

CREATE INDEX IF NOT EXISTS ix_products_name ON products(name);
CREATE INDEX IF NOT EXISTS ix_products_id ON products(id);

-- Orders table matching models.Order
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price FLOAT,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_orders_id ON orders(id);

-- OrderItems table matching models.OrderItem
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price FLOAT
);

CREATE INDEX IF NOT EXISTS ix_order_items_id ON order_items(id);

-- Payments table matching models.Payment
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount FLOAT,
    status VARCHAR,
    provider VARCHAR DEFAULT 'manual'
);

CREATE INDEX IF NOT EXISTS ix_payments_id ON payments(id);