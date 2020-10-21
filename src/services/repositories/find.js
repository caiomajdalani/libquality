// const { Op } = require("sequelize");

module.exports = app => (model, query = {}, offset = 0, limit = 10, attributes = {exclude: ['active', 'createdAt', 'updatedAt']}) => 
    app.src.database.mysql.models[model].findAndCountAll({where: query, attributes, offset: offset, limit: limit, order: [['id', 'DESC']]})
        .then(data => ({ data }))
        .catch(error => ({ error }))