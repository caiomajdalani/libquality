'use strict'

module.exports = app => (model, items) => 
    app.src.database.mysql.models[model].bulkCreate(items)
        .then(data => ({ data }))
        .catch(error => ({ error }))
