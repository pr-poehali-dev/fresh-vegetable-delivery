CREATE TABLE IF NOT EXISTS t_p20462627_fresh_vegetable_deli.reviews (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  city varchar(100) NOT NULL DEFAULT 'Уфа',
  text text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  avatar varchar(10) NOT NULL DEFAULT '👤',
  approved boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT now()
);