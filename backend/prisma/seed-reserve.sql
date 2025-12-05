INSERT INTO "ReserveAccount" (currency, balance)
VALUES
    ('EMC', 1000000),
    ('USD', 0),
    ('EUR', 0),
    ('GBP', 0),
    ('KES', 0),
    ('NGN', 0),
    ('ZAR', 0),
    ('BTC', 0)
ON CONFLICT (currency)
DO UPDATE SET balance = EXCLUDED.balance;
-- This seed file initializes the ReserveAccount table with default currencies and balances.