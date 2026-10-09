-- ============================================================================
-- Manufacturing ERP - PostgreSQL Database Initialization Script
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone to UTC for accurate timestamp synchronization across global facilities
SET timezone = 'UTC';

-- Grant required permissions
GRANT ALL PRIVILEGES ON DATABASE manufacturing_erp TO CURRENT_USER;
