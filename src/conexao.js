const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "desafio_final",
  password: "123456",
  port: 5432,
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
