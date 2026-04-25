
CREATE TABLE t_p20462627_fresh_vegetable_deli.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  points INTEGER NOT NULL DEFAULT 0,
  is_first_order_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p20462627_fresh_vegetable_deli.sms_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE t_p20462627_fresh_vegetable_deli.loyalty_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p20462627_fresh_vegetable_deli.users(id),
  points INTEGER NOT NULL,
  reason VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
