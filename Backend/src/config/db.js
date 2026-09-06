

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');


const usarSSL = process.env.DB_SSL === 'true';
const caminhoCA = path.join(__dirname, 'ca.pem');
const temArquivoCA = usarSSL && fs.existsSync(caminhoCA);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(usarSSL && {
    ssl: temArquivoCA
      ? { ca: fs.readFileSync(caminhoCA) }
      : { rejectUnauthorized: true },
  }),
});

module.exports = pool;