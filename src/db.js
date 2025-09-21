import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,           // kalau pakai Azure atau SSL
    trustServerCertificate: true // kalau server lokal
  }
};

let pool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
