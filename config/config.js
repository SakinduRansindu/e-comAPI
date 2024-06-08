require("dotenv").config();
module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "ecomdb",
    "host": "localhost",
    "dialect": process.env.DB_DIALECT || "mysql",
    "port": process.env.DB_PORT || 3306,
    "jwtSecret": "secret",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
};
