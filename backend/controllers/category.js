const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const logger = require("../utils/logger");
const Ticket = require("../models/ticket");


categoriesRouter.get('/', async (request, response) => {

    const categories = await Category
        .find({})

    response.json(categories)
})

categoriesRouter.post('/', async (request, response) => {

    const body = request.body

    const category = new Category({
        text: body.text,
        value: body.value,
    })

    const savedTicket = await category.save()
    response.json(savedTicket)
})


module.exports = categoriesRouter