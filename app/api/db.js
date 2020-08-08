const Sequelize = require('sequelize')

// Fallback if api isn't running inside docker. 
if (!process.env.POSTGRES_USER) {
  // Read from .env file
  require("dotenv").config();
}

// db configuration
const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DBNAME;
const password = process.env.POSTGRES_PASS;
const port = process.env.POSTGRES_PORT;
console.log("DB USER: ", user)

const sequelize = new Sequelize(database, user, password, {
  host: host || 'localhost',
  dialect: 'postgres',
  port: port || 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

module.exports = sequelize
