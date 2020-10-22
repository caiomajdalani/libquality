const http = require('http')
const logger = require('../services/utils/logger')
const createDatabaseIfNotExists = require('../database/utils/createDatabaseIfNotExists')
const dbConfig = require('../database/config')
const Sequelize = require('sequelize')
require('dotenv').config()
let _server 

module.exports = async app => {

    try {

        await createDatabaseIfNotExists(Sequelize, dbConfig)
        
        app.src.database.mysql.sequelize.sync().done(() => {
            _server = http.createServer(app)
                .listen(app.get("port"), () => {
                    logger.info(`[*] API ${app.get('version')} RUNNING ON PORT ${app.get(
                        'port'
                    )} | ENVIRONMENT : ${app.get('env')}`);
                });
        })

        process.on('SIGINT', async () => {
        
            await app.src.database.mysql.sequelize.close()
                .then(() => logger.info('[*] SEQUELIZE GET DISCONNECTED ON API TERMINATION.'))
                .catch(err => logger.error({message: "[!] ERROR DISCONNECTING SEQUELIZE.", meta: new Error(err)}))
            
            _server.close((err) => {
                if (err) {
                    logger.error({message: "[!] ERROR CLOSING SERVER.", meta: new Error(err)})
                    process.exit(1)
                }
                logger.info('[*] SERVER GET DISCONNECTED.')
                process.exit(0)
            })
        });
        
    } catch (error) {
        logger.error({message: `[!] UNABLE TO START SERVER: `, meta: new Error(error)})
    }

}