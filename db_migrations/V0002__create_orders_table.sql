CREATE TABLE IF NOT EXISTS t_p20462627_fresh_vegetable_deli.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    comment TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);