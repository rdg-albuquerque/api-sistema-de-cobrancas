const { Pool } = require("pg");

const pool = new Pool({
  user: "nobfqkzlhpbkdx",
  host: "ec2-54-87-112-29.compute-1.amazonaws.com",
  database: "dfad2m6jhg3vkm",
  password: "8e637313271b77d21fed179566388d391d41d7efdf19b5b39c605b58d4fec938",
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
