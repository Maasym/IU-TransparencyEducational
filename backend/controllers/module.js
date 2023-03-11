const modulesRouter = require('express').Router()
const Module = require('../models/module')
const logger = require("../utils/logger")


modulesRouter.get('/', async (request, response) => {

    const modules = await Module
        .find({})

    response.json(modules)
})

modulesRouter.post('/', async (request, response) => {

    const body = request.body

    const module = new Module({
        text: body.text,
        value: body.value,
    })

    const savedTicket = await module.save()
    response.json(savedTicket)
})

module.exports = modulesRouter