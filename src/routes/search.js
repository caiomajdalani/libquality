const controllers = require('../controllers/search')

module.exports = app => {
    app
        .route('/search')
        .get(async(request, response) => controllers.search(app)(request, response));

}