-- PostgreSQL initialization script
-- This runs automatically when the container is first created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
