ALTER TABLE t_p20462627_fresh_vegetable_deli.users
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(8) UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by INTEGER REFERENCES t_p20462627_fresh_vegetable_deli.users(id);

UPDATE t_p20462627_fresh_vegetable_deli.users
SET referral_code = UPPER(SUBSTRING(MD5(id::text || phone), 1, 6))
WHERE referral_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_idx ON t_p20462627_fresh_vegetable_deli.users(referral_code);
