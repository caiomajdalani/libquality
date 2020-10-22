<div align="center">
  <br />
  <h1>Venturus</h1>
</div>

<p align="center">
  LibQuality API
</p>

---

## Dependencies

- NodeJS 12.16.0 LTS (https://nodejs.org/en/)
- MySQL 5.7.29 +

## Start

- For start on a local environment, you must have MySQL running on port 3306:
```sh
$ npm install pm2 -g
$ npm install 
$ npm run start:local
```

- For start on Docker environment:
```sh
$ npm run up:dev
```

# IMPORTANT

- Ensure that you create a ".env" file with your personal access token to "GITHUB_TOKEN" variable. The API uses it at "Authorization" headers.

```diff
{ 
  'Authorization': `token ${process.env.GITHUB_TOKEN}` 
}
```

(https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)

## Docs

- To see swagger docs:
    
    - http://localhost:3000/api-docs

<div>
  <a title="venturus-swagger">
    <img src="https://i.imgur.com/2hGGUgc.png"/>
  </a>
</div>

## Tests

- To test and see the coverage on CLI:

```sh
$ npm test
```

- If will want to see more details about the coverage, open the follow file in your Browser:

    - ./coverage/lcov-report/index.html

## Frameworks/Libraries

- API
    - [Joi](https://www.npmjs.com/package/joi) - Http schema validations
    - [Body-Parser](https://www.npmjs.com/package/body-parser) - Body parsing middleware
    - [Consign](https://www.npmjs.com/package/consign) - Autoload scripts
    - [Cors](https://www.npmjs.com/package/cors) - A Connect/Express middleware to enable CORS.
    - [Express](https://www.npmjs.com/package/express) - Web framework
    - [Express-Swagger-Generator](https://www.npmjs.com/package/express-swagger-generator) - A module to serve swagger files based on [express-swaggerize-ui](https://github.com/pgroot/express-swaggerize-ui) and [Doctrine-File](https://github.com/researchgate/doctrine-file)
    - [Express-Winston](https://www.npmjs.com/package/express-winston) - Winston middleware for Express
    - [Helmet](https://www.npmjs.com/package/helmet) - Improves security of Express apps by setting various HTTP headers
    - [Mathjs](https://www.npmjs.com/package/mathjs) - A extensive math library for JavaScript and Node.js
    - [Moment](https://www.npmjs.com/package/moment) - A JavaScript date library for parsing, validating, manipulating, and formatting dates
    - [Mysql2](https://www.npmjs.com/package/mysql2) - MySQL client for Node.js
    - [Sequelize](https://www.npmjs.com/package/sequelize) - Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server
    - [Traverson](https://www.npmjs.com/package/traverson) - A Hypermedia API/HATEOAS Client for Node.js and the Browser
    - [Winston](https://www.npmjs.com/package/winston) - A logger for just about everything
- DevOps
    - [PM2](https://pm2.keymetrics.io/) - Process Manager for Nodejs
    - [Docker](https://www.docker.com/) - Package and run application
- Unit Tests
    - [Jest](https://www.npmjs.com/package/jest) - Testing Framework
    - [Sequelize-mock](https://www.npmjs.com/package/sequelize-mock) - A mocking interface designed for testing code that uses Sequelize.

## Basic Project Structure

```
-----------------───────────────────── Root
├── docker/ ────────────────────────── Dockerfiles
├── ecosystem-config/ ──────────────── PM2 config files
├── src/ ───────────────────────────── API Source
│   ├── __tests__/ ─────────────────── Unit tests 
│   ├── controllers/ ───────────────── API Controllers
│   ├── database/ ──────────────────── MySQL cofig and other files
│   ├── docs/ ──────────────────────── Swagger docs
│   ├── middlewares/ ───────────────── Middlewares injections
│   ├── models/ ────────────────────── MySQL models
│   ├── routes/ ────────────────────── API Routes
│   ├── server/ ────────────────────── API Server
│   ├── services/ ──────────────────── External functions and helpers
│   ├── index.js ───────────────────── Main file
├── docker-compose.yml ─────────────── Docker Compose file
├── jest.config.js ─────────────────── Config file for Jest
├── jestSetup.js ───────────────────── Setup file for Jest
├── README.md                       
```

## How it Works

<a title="LibQuality API">
  <img src="https://i.imgur.com/0qrlbmB.png"/>
</a>

1. The user send a GET request to "/search" with the "project" he wants to search and his "user" on query:
(project only accepting "vue" or "react" for now)

```sh
$ curl --request GET '${HOST}:${PORT}/search?project=${project}&user=${user}'
```

2. The application will try to find data from this project on database.
  - If there is no data from this project on database, the application will follow the step <b><u>3</u></b>.
  - If it finds anything, the application will now check if this data have more than 1 day
    - If the data have more than 1 day, the application will update this data to inactive on database, and follow the step <b><u>3</u></b>
    - If the data have less than 1 day, the application will follow the step <b><u>6</u></b>

3. The application will send a GET request for Github API with the following data:

```sh
$ curl --request GET 'https://api.github.com/search/issues?q=repo:${repository}+state:open&sort=created&order=desc&per_page=100'
```
  - For this, the response from github is something like that:

  ```diff
    {
      "total_count": 527,
      "incomplete_results": false,
      "items": [ {...}, {...}, ... ]
    }
  ```

  - The property "items" is a array of objects, with each one of them a issue. However, even with the "total_count" property, 
  the github api only returns 100 (at max) items for each page. So, our application will identify the "follow" link no headers and continue to send requests to 
  next pages until all are done to get all items.

  <div>
    <a title="link-headers">
      <img src="https://i.imgur.com/CcTVwiw.png"/>
    </a>
  </div>

4. After all reqs finish, the application will map all results and make the calculations needed for "avgAge" (Average Age in days) and "stdAge" (Standar Deviation in days) based on Today's Date.
  - After that, the project data will be saved on "project" table on database.
  <div>
    <a title="project-data">
      <img src="https://i.imgur.com/eACwzOe.png"/>
    </a>
  </div>
  - And a log of that search will be saved on "searchLog" table on MySQL
  <div>
    <a title="log-data">
      <img src="https://i.imgur.com/q48gdUn.png"/>
    </a>
  </div>

5. The application will return to user to user the informations requested on response body

  ```diff
    {
      "status": 200,
      "message": "OK",
      "result": {
          "repository": "vuejs/vue",
          "issues": 527,
          "avgAge": 547,
          "stdAge": 31
      }
    }
  ```

## TODO

- Statistics route/controller
  - The day by day data is already on MySQL, we need to create a route to organize this data for user consumes.
- Integrated Unit Tests
  - Mock express, to test the start of application, routes and controllers
  - Mock Sequelize (MySQL), to test connections, repositories, models and queries
- Automated Tests
  - The main goal is to create automated tests with BDD, using libs like SuperTest, Mocha and Chai. This tests need to be user tests, and can entender on CI/CD to ensure to block deploy if some issue pass through unit tests during build.
- CI/CD (Jenkins, GitLab..)
- Redis 
  - Used as a "cache" to remove the dependency from MySQL as fresh data. Also to ensure the application will not crash and can be continue to retrieve data for users if something happens with database. 