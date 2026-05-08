import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
  maxIdle: 2,
  idleTimeout: 60000,
  enableKeepAlive: false,
  keepAliveInitialDelay: 0,
};

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

export const pool  = global.mysqlPool || mysql.createPool(config);

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool ;
}

export default pool ;
