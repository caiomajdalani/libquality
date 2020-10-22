describe('Database - ', () =>{

    describe('Config - ', () => {

        const OLD_ENV = process.env;

        beforeEach(() => {
            jest.resetModules() // most important - it clears the cache
            process.env = { ...OLD_ENV }; // make a copy
        });
    
        afterAll(() => {
            process.env = OLD_ENV; // restore old env
        });
    
        it('Without Env variables injected', async () => {
            const config = require('../database/config')
            expect(config.database).toEqual('libquality')
            expect(config.username).toEqual('root')
            expect(config.password).toEqual('admin')
            expect(config.params.host).toEqual('localhost')
            expect(config.params.port).toEqual(3306)
        })
    
        it('With Env variables injected', async () => {
            process.env.MYSQL = JSON.stringify({
                DATABASE: "venturus",
                USERNAME: "root",
                PASSWORD: "admin",
                HOST: "localhost",
                PORT: 3306
            })
            const config = require('../database/config')
            expect(config.database).toEqual('venturus')
            expect(config.username).toEqual('root')
            expect(config.password).toEqual('admin')
            expect(config.params.host).toEqual('localhost')
            expect(config.params.port).toEqual(3306)
        })
    
        it('Testing logging.info config', async () => {
            const config = require('../database/config')
            let value = config.params.logging('Testing logger..')
            expect(value).toBe(undefined)
        })
    })
    describe('CreateDatabaseIfNotExists - ', ()=>{
        const Sequelize = require('sequelize')
        const createDatabaseIfNotExists = require('../database/utils/createDatabaseIfNotExists')
        it('Returns Error', async()=>{
            let dbConfig = {
                database: 'test',
                username: 'test',
                password: 'test',
                params: {
                  host: 'test',
                  dialect: 'mysql',
                  port: 6793
                }
            }
            const res = await createDatabaseIfNotExists(Sequelize, dbConfig)
            expect(res instanceof Error).toBe(true)
        })
    })

})