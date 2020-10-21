module.exports = app => (model, obj, query) => 
    app.src.database.mysql.models[model].update(obj, {where: query})
        .then(data => ({ data }))
        .catch(error => ({ error }))