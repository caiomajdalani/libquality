'use strict'

const express = require('express');
const app = express();
const logger = require('./services/utils/logger')

// ----------------------------------------------------------------------------------------------

const consign = require('consign');

try {
  consign({verbose: false})
    .include('./src/database/config.js')
    .then('./src/database/mysql.js')
    .then("./src/middlewares")
    .then("./src/routes")
    .then('./src/services/repositories')
    .then('./src/docs/swagger.js')
    .then("./src/server/start.js")
    .into(app);
} catch (error) {
  logger.error({message: "[!] INTERNAL SERVER ERROR.", meta: new Error(error)})
}
    
// ----------------------------------------------------------------------------------------------


module.exports = app;