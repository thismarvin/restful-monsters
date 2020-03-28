require("dotenv").config();

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_DATABASE_HOST,
        port: process.env.MYSQL_DATABASE_PORT,
        user: "root",
        password: process.env.MMYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE
    },
    migrations: {
      directory: "./backend/database/migrations"
    }
  }
  
};
