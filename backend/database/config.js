require("dotenv").config();

const config = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_DATABASE_HOST,
      port: process.env.MYSQL_DATABASE_PORT,
      user: "root",
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    migrations: {
      directory: "./backend/database/migrations"
    }
  }
};

function getConfig() {
  return config[process.env.ENVIRONMENT];
}

module.exports = {
  getConfig
};