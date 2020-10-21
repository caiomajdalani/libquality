module.exports = app => (model, query) => 
    app.src.database.mysql.models[model].findOne({where: query})
        .then(data => ({ 
            data: data.get({
                plain: true
            })
         }))
        .catch(error => ({ error }))

