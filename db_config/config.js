require('dotenv').config();

const { Pool } = require('pg');

const conn_string = "postgres://halunzavnhwret:a3840ebed6006a0fceef4174f994c98c04d79061a335974572cb77b8d47fe007@ec2-54-160-109-68.compute-1.amazonaws.com:5432/df90pc3jsa3kpp";

pool = new Pool({

  connectionString: conn_string,
  ssl: {
    rejectUnauthorized: false
  }

    /*user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    */
  })

module.exports = pool;
