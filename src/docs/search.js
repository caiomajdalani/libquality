/**
 * @typedef responseSearch
 * @property {integer} status - Http Response Status Code
 * @property {string} message - Http Response Status Message
 * @property {resultSearch.model} result - Result from querying
*/

/**
 * @typedef resultSearch
 * @property {string} repository - Project Repository
 * @property {integer} issues - Quantity of issues with status open
 * @property {integer} avgAge - Issues's average age in days
 * @property {integer} stdAge - Issues's standard deviation time in days
 */

/**
 * Find Project
 * @route GET /search
 * @group SEARCH - Resource for Search.
 * @param {string} user.query.required - Request Username
 * @param {string} project.query.required - Project to find data
 * @returns {responseSearch.model} 200 - Project data
 * @returns {Error} 400 - Invalid properties.
 * @returns {Error} 401 - Unauthorized.
 * @returns {Error} 409 - Business error.
 * @returns {Error} 422 - UnprocessableEntity.
 * @returns {Error} 500 - Internal server error.
*/

exports.foo = () => {}