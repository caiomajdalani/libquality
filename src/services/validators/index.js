const Joi = require('@hapi/joi');

const schema = {
    search: Joi.object({
        query: Joi.object({
            user: Joi.string().required(),
            project: Joi.string().required().valid('react', 'vue')
        })
    }).unknown()
}

module.exports = schema;

