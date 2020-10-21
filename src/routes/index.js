// Just a browser "Health Check =)"

const replies = require('../services/replies')
module.exports = app => {
    app.get("/", (request, response) => {
        return replies.ok(response)('LibQuality - API')
    });
};  