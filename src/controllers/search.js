const replies = require('../services/replies')
const logger = require('../services/utils/logger')
const validator = require('../services/validators')
const math = require('mathjs')
const traverson = require('traverson');
const { promisify } = require('util')
const moment = require('../services/utils/moment')

const _query = (request) => {
    let { user, project } = request.query
    let repo = project == 'vue' ? 'vuejs/vue' : 'facebook/react'
    return { user, repo }
}

module.exports = {
    search: (app) => async (request, response) => {
        try {

            // A simple http validation using Joi
            const { value: dataValidation, error: errorValidation } = await validator.search.validate(request, {abortEarly: false})
            if (errorValidation) {
                let messages = []
                for (const error of errorValidation.details) messages.push(error.message.split('\"').join('\''))
                return replies.badRequest(response)(messages)
            } else { 
                
                // Organizing the query params
                const {user, repo} = _query(request)

                /**
                 * Here we will try to find some data about this project on MySQL
                 */
                const { data: dataFindProject, error: errorFindProject } = await app.src.services.repositories.findOne('project', {repository: repo, active: true}) 
                if(dataFindProject){
                    
                    // Now we need to verify if this data is "hot", getting the difference between the date the registry was created (created_at) and today
                    const diff = moment._getHours(dataFindProject.createdAt)
                    // If the difference is fewer than 1 day, i am considering that the data is still "hot"
                    if(diff < 24) {

                        // So we create the log from this search using the User and Project/Repository and sabe at Searchlog table
                        const { data: dataCreateSearchLog, error: errorCreateSearchLog } = await app.src.services.repositories.create('searchlog', {
                            user: user,
                            project: dataFindProject.repository
                        })
                        if(errorCreateSearchLog) {
                            logger.error({message: "Error saving on Database", meta: new Error(errorCreateSearchLog)})
                            return replies.unprocessableEntity(response)('Error.')
                        } else {

                            // And we can respond to user (this response time is something like 50-60ms)
                            return replies.ok(response)({
                                repository: dataFindProject.repository,
                                issues: dataFindProject.issues,
                                avgAge: dataFindProject.avgAge,
                                stdAge: dataFindProject.stdAge
                            })
                        }

                    } else {

                        // But if the difference is greater, then we need to "delete logic" that data (deactivate) to maintain the registry on database for future purposes
                        const { data: dataUpdateProject, error: errorUpdateProject } = await app.src.services.repositories.update('project', { active: false }, {id: dataFindProject.id})
                        if(errorUpdateProject){
                            logger.error({message: "Error updating on Database", meta: new Error(errorUpdateProject)})
                            return replies.unprocessableEntity(response)('Error.')
                        }

                    }
                } 

                /**
                 * At this point, we have a limitation on use Github API. They use a Restful concept called Hateoas, that 
                 * only returns 100 items per page (at max), and supports a "link rel" on response headers to the next page.
                 * And each page have a response time of about 3 seconds.
                 * However, they permit only 10 reqs per minute (https://api.github.com/rate_limit), with a unauthenticated user.
                 * With a authenticated user, we can make 30 req per minute. But for some repos (like angular, which have 3200 issues opened at this moment),
                 * this will not work as expected (for this motive i removed angular from the possible search). And the response time is too much longer (58s for react, which have 572 issues opened). 
                 * I will use my personal token on this test,  but if this were get to prod env, i can suggest some future workarounds:
                 * 
                 * 1. Instead use the API to get the data from GitHub API directly, we can make Cron jobs (like workers) to get this data overtime (not realtime),
                 * and save them on the MySQL (cause this data dont change a lot in one day for a example). With this, we can make the API get the data from MySQL, 
                 * and its performance will be a lot better for user (response time).
                 * 
                 * PS: To solve this at least "for the moment" (rsrs), this route should work as a "refresh" data on the database for the first request, if the data from
                 * MySQL have more than 1 day. With that, we can make the first request get the "hot" info from github and save on the database, but the nexts requests will 
                 * get the info from MySQL directly (better response time).
                 * 
                 * 2. Instead of using v3 github API, it could be much better is to use the GraphQL v4, that we can manipulate which results we need the API to return,
                 * and this should be way less impactating on response time, cause on v3 we dont use a lot of info that is returned from API.
                 * 
                 * 3. Instead of use MySQL to save data and one endpoint to refresh data on base and search, we could use Redis as a cache with a "limit time"
                 * that it store the data (1 day for example). With that, we can search on redis first, and if there is the info we need, just returns to user in less response time. 
                 * If not, get the info from github API and save again at Redis (this will take some time but will happens only 1x at day)
                 */

                /**
                 * We need to use a module like traverson to get the link rel on headers to "follow" req and get all pages 
                 */
                const hateoas = traverson
                    .from(`https://api.github.com/search/issues?q=repo:${repo}+state:open&sort=created&order=desc&per_page=100`)
                    .json()
                    .linkHeader()
                    .withRequestOptions({ 
                        headers: 
                        { 
                            'Accept': 'application/vnd.github.v3+json', // Required by github v3 API
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36', // It can be any valid user agent
                            'Authorization': 'token 44de29a5b6e2f5f85b5028a90d4dc8ae17f428cc' // Just for this test only, i will delete this token in the future. The best practice is to make this a secret environment variable.
                        }
                    })

                // I did this implementation cause traverson only supports callbacks, but i needed a promise to one request wait for another request to finish
                const getResourceAsync = promisify(hateoas.getResource.bind(hateoas))

                let results = []
                    , hateoasNext
                    , getResourceAsyncNext

                // Here we will make the first request (the page 1)
                let result = await getResourceAsync()

                // And push the result to a array to make manipulations after all requests done. 
                results.push(result)

                /**
                 * This loop is to ensure that the traverson will continue to make requests and follow "next" link until 
                 * there is no more link "next" on _linkheaders property of result.
                 */ 
                for (let cont = 2; result._linkHeaders.next; cont++) {

                    hateoasNext = hateoas
                        .follow('next')
                    
                    getResourceAsyncNext = promisify(hateoasNext.getResource.bind(hateoasNext))

                    result = await getResourceAsyncNext()
                    results.push(result)
                }

                let std = []
                let sumAll = 0

                // Now with all requests done and the results saved, we can manipulate the data to get what we want.
                for (const [i, res] of results.entries()) {
                    let {sum, newList} = moment._getDatesFromList(res.items)
                    sumAll += sum // Getting the sum of days to divide by the total number of issues
                    std.push(math.std(newList)) // Generating a new list with STD results of the issues on each page
                }

                // Here we will save the new project info on the database
                const { data: dataCreateProjectInfo, error: errorCreateProjectInfo } = await app.src.services.repositories.create('project', {
                    repository: repo,
                    issues: result.total_count,
                    avgAge: Math.round(sumAll/result.total_count),
                    stdAge: Math.round(math.std(std))
                })
                if(errorCreateProjectInfo){
                    logger.error({message: "Error saving on Database", meta: new Error(errorCreateProjectInfo)})
                    return replies.unprocessableEntity(response)('Error.')
                } else {

                    // So we create the log from this search using the User and Project/Repository and save at Searchlog table
                    const { data: dataCreateSearchLog, error: errorCreateSearchLog } = await app.src.services.repositories.create('searchlog', {
                        user: user,
                        project: repo
                    })
                    if(errorCreateSearchLog) {
                        logger.error({message: "Error saving on Database", meta: new Error(errorCreateSearchLog)})
                        return replies.unprocessableEntity(response)('Error.')
                    } else {

                        // And we can respond to user (This will take sometime. On a simple environment this should take 60s to resolve)
                        return replies.ok(response)({
                            repository: repo,
                            issues: result.total_count, // Number of total issues opened
                            avgAge: Math.round(sumAll/result.total_count), // The number of average time in days they are opened
                            stdAge: Math.round(math.std(std)) // The final standard deviation time in days
                        })
                    }

                }

            }
            
        } catch (error) {
            logger.error({message: "Internal server error", meta: new Error(error)})
            return replies.internalServerError(response)('Error.')
        }
    }
}