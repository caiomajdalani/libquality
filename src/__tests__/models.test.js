
describe('Models', ()=>{
    let SequelizeMock = require('sequelize-mock');
    let sequelize = new SequelizeMock();
    describe('Define Models', ()=>{
        it('Project', ()=>{
            let model = sequelize.import('../models/project.js')
            expect(model.name).toEqual('project')
            expect(model._defaults).toHaveProperty('repository')
            expect(model._defaults).toHaveProperty('issues')
            expect(model._defaults).toHaveProperty('avgAge')
            expect(model._defaults).toHaveProperty('stdAge')
            expect(model._defaults).toHaveProperty('active')
        })
        it('Searchlog', ()=>{
            let model = sequelize.import('../models/searchLog.js')
            expect(model.name).toEqual('searchlog')
            expect(model._defaults).toHaveProperty('user')
            expect(model._defaults).toHaveProperty('project')
        })
    })
})