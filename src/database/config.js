'use strict'

const logger = require('../services/utils/logger')
const { MYSQL } = process.env
const _mysql = MYSQL ? JSON.parse(MYSQL) : null

module.exports = {
  database: _mysql ? _mysql.DATABASE : 'libquality',
  username: _mysql ? _mysql.USERNAME : 'root',
  password: _mysql ? _mysql.PASSWORD : 'admin',
  params: {
    host: _mysql ? _mysql.HOST : 'localhost',
    dialect: 'mysql',
    port: _mysql ? _mysql.PORT : 3306,
    logging: (sql) => {
      logger.info(sql);
    },
    define: {
      underscored: true
    }
  }
};
