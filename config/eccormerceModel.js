import pg from "pg";
import "dotenv/config"


const { Pool } = pg;



const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use an environment variable for security
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
