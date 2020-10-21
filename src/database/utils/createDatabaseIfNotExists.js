const logger = require('../../services/utils/logger')

const createDatabaseIfNotExists = (Sequelize, dbConfig) => {
    const sequelize = new Sequelize('', dbConfig.username, dbConfig.password, dbConfig.params);
    return sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`)
        .then(data => {
            if(data[0].warningStatus == 1) {
                logger.info(`[*] DATABASE ${dbConfig.database} ALREADY EXISTS`)
            } else {
                logger.info(`[*] DATABASE ${dbConfig.database} CREATED SUCCESSFULLY`)
            }
            return data
        })
        .catch(error => {
            logger.error({message: `[!] UNABLE TO CREATE THE DATABASE ${dbConfig.database}: `, meta: new Error(error)})
            return error
        });
};

module.exports = createDatabaseIfNotExists;

