const mysql = require('mysql2/promise');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

console.log(config);

async function createDatabaseIfNotExists(skip=false) {
    if (skip) {
      console.log('Skipping database creation.');
      return;
    }
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
  