import pg from "pg";
import { config } from "../config";

const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'contributor',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL CHECK (length(description) >= 20),
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  console.log("database successfully connected!");
};

export { initDb, pool };
