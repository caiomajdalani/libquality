const replies = require('../services/replies/index')
const validators = require('../services/validators')
const moment = require('../services/utils/moment')
const findOne = require('../services/repositories/findOne')


describe('Services', ()=>{
    const res = () => {
        return {
            status: ()=>{
                return {
                    json: (data)=>{
                        return data
                    },
                }
            },
        }
    }
    describe('Replies', ()=>{
        let response = res()
        it('OK', ()=>{
            let result = replies.ok(response)({})
            expect(result.status).toBe(200)
            expect(result.message).toBe('OK')
        })
        it('CREATED', ()=>{
            let result = replies.created(response)({})
            expect(result.status).toBe(201)
            expect(result.message).toBe('CREATED')
        })
        it('ACCEPTED', ()=>{
            let result = replies.accepted(response)({})
            expect(result.status).toBe(202)
            expect(result.message).toBe('ACCEPTED')
        })
        it('BADREQUEST', ()=>{
            let result = replies.badRequest(response)({})
            expect(result.status).toBe(400)
            expect(result.message).toBe('BADREQUEST')
        })
        it('UNAUTHORIZED', ()=>{
            let result = replies.unauthorized(response)({})
            expect(result.status).toBe(401)
            expect(result.message).toBe('UNAUTHORIZED')
        })
        it('NOTFOUND', ()=>{
            let result = replies.notFound(response)({})
            expect(result.status).toBe(404)
            expect(result.message).toBe('NOTFOUND')
        })
        it('CONFLICT', ()=>{
            let result = replies.conflict(response)({})
            expect(result.status).toBe(409)
            expect(result.message).toBe('CONFLICT')
        })
        it('UNPROCESSABLE', ()=>{
            let result = replies.unprocessableEntity(response)({})
            expect(result.status).toBe(422)
            expect(result.message).toBe('UNPROCESSABLE')
        })
        it('ERROR', ()=>{
            let result = replies.internalServerError(response)({})
            expect(result.status).toBe(500)
            expect(result.message).toBe('ERROR')
        })
    })
    describe('Validators', ()=>{
        describe('Search', ()=>{

            it('Valid Query', async ()=>{
                let request = {
                    query: {
                        user: 'caio',
                        project: 'react'
                    }
                }
                
                const { value: dataValidation, error: errorValidation } = await validators.search.validate(request, {abortEarly: false})
                expect(errorValidation).toBeUndefined()
            })

            it('User invalid', async ()=>{
                let request = {
                    query: {
                        user: '',
                        project: 'react'
                    }
                }

                const { value: dataValidation, error: errorValidation } = await validators.search.validate(request, {abortEarly: false})
                expect(errorValidation).toBeTruthy()
            })

            it('Project invalid', async ()=>{
                let request = {
                    query: {
                        user: 'caio',
                        project: 'project'
                    }
                }

                const { value: dataValidation, error: errorValidation } = await validators.search.validate(request, {abortEarly: false})
                expect(errorValidation).toBeTruthy()
            })

        })
    })
    describe('Utils', ()=>{
        describe('Moment', ()=>{
            it('Test Date Difference (Days)', ()=>{
                let date = '2020-10-19'
                let res = moment._getDays(date)
                expect(res).toBeGreaterThan(1)
            })
            it('Test Date Difference (Hours)', ()=>{
                let date = '2020-10-19'
                let res = moment._getHours(date)
                expect(res).toBeGreaterThan(24)
            })
            it('Test Return List Function', ()=>{
                let items = [{created_at: '2020-10-19'}, {created_at: '2020-10-19'}, {created_at: '2020-10-19'}]
                let res = moment._getDatesFromList(items)
                expect(res.sum).toBeGreaterThan(5)
                expect(res.newList.length).toEqual(3)
            })
        })
        describe('Logger', ()=> {
            it('Error', ()=>{
                process.env.NODE_ENV = 'testLog'
                const logger = require('../services/utils/logger')
                let res = logger.error({message: `Testing..`, meta: new Error()})
                expect(res).toBeTruthy()
            })
            it('Info', ()=>{
                process.env.NODE_ENV = 'testLog'
                const logger = require('../services/utils/logger')
                let res = logger.info(`Testing..`)
                expect(res).toBeTruthy()
            })
        })
    })
})