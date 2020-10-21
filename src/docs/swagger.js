

module.exports = app => {
    //swaggger 
    const expressSwagger = require('express-swagger-generator')(app);
    let options = {
        swaggerDefinition: {
            info: {
                description: 'Serve Swagger files to LibQuality API',
                title: 'LibQuality API',
                version: '1.0.0',
            },
            host: `${app.get('host')}:${app.get('port')}`,
            basePath: '/',
            produces: [
                "application/json"
            ],
            schemes: ['http'],
        },
        basedir: __dirname, 
        files: ['./*.js'] 
    };
    expressSwagger(options)
}