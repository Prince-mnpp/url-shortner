import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Fallback to your explicit connection string if process.env isn't ready during the import phase
const connectionString = process.env.DATABASE_URL || "mysql://root:Prince%40562630@localhost:3306/drizzle_yt_db";

// Create a connection pool instead of passing a raw string
const pool = mysql.createPool(connectionString);

export const db = drizzle(pool);