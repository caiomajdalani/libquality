'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize');
const logger = require('../services/utils/logger')

let mysql;

module.exports = app => {
  
    const sequelize = new Sequelize(
      app.src.database.config.database,
      app.src.database.config.username,
      app.src.database.config.password,
      app.src.database.config.params
    )

    sequelize
        .authenticate()
        .then(() => {
          logger.info(`[*] DATABASE ${app.src.database.config.database} CONNECTED SUCCESSFULLY`)
        })
        .catch(error => {
          logger.error({message: `[!] UNABLE TO CONNECT TO THE DATABASE ${app.src.database.config.database}: `, meta: new Error(error)})
        });

    mysql = {
      sequelize,
      Sequelize,
      models: {}
    };

    const dir = path.join(__dirname, "../models");
    fs.readdirSync(dir).forEach(file => {
        const modelDir = path.join(dir, file);
        const model = mysql.sequelize.import(modelDir);
        mysql.models[model.name] = model;
    });

    return mysql
    
  

};