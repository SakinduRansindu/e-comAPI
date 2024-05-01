const mysql = require('mysql2/promise');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

async function createDatabaseIfNotExists() {
    try {
      const connection = await mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password
      });
  
      const databaseName = config.database;
  
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
      console.log(`Database '${databaseName}' created or successfully checked for existence.`);
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }

module.exports = createDatabaseIfNotExists;
  