// Database connection configuration
const pgConfig = {
  user: process.env.DEV_USER || "postgres",
  password: process.env.DEV_DB_PASSWORD || "tuan123456",
  host: process.env.DEV_DB_HOST || "localhost",
  port: process.env.DEV_DB_PORT || "5432",
  database: process.env.DEV_DB_NAME || "rent-house-db",
};

module.exports = pgConfig;
