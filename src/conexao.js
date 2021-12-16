const env = require("dotenv");
const { parsed } = env.config();

const { Pool } = require("pg");

const pool = new Pool({
  user: parsed.DB_USER,
  host: parsed.DB_HOST,
  database: parsed.DB_NAME,
  password: parsed.DB_PASSWORD,
  port: parsed.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = (text, param) => {
  return pool.query(text, param);
};

module.exports = {
  query,
};
