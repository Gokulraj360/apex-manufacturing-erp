-- Manufacturing ERP PostgreSQL Initialization Script
-- Ensures necessary extensions and schemas exist

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions if necessary
GRANT ALL PRIVILEGES ON DATABASE manufacturing_erp TO CURRENT_USER;

-- Set timezone to UTC for consistent manufacturing shift and audit tracking
SET timezone = 'UTC';
