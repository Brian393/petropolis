const Sequelize = require('sequelize')
const fs = require("fs");
const path = require("path");

// Fallback if api isn't running inside docker. 
if (!process.env.NODE_ENV) {
  // Read from .env file
  require("dotenv").config();
}

// Load configuration based on environment
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, '/config/config.json'))[env]

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host || 'localhost',
  dialect: 'postgres',
  port: config.port,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

module.exports = sequelize

