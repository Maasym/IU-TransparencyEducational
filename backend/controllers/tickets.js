const ticketsRouter = require('express').Router()
const Ticket = require('../models/ticket')
const logger = require("../utils/logger");
const User = require('../models/user')
const Token = require('../utils/middleware')
const jwt = require('jsonwebtoken')


ticketsRouter.get('/', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    if(user.role === 'admin'){
        const tickets = await Ticket
            .find({})

        response.json(tickets)
    } else if(user.role === 'student'){
        const tickets = await Ticket
            .find({user: userId})

        response.json(tickets)
    }

})

ticketsRouter.get('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    if(user.role === 'admin'){
        const tickets = await Ticket
            .find({ticketNumber: request.params.id})

        response.json(tickets)
    } else if(user.role === 'student'){
        const tickets = await Ticket
            .find({user: userId, ticketNumber: request.params.id} )

        response.json(tickets)
    }

})

ticketsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(body.userId)

    if (body.text === undefined) {
        return response.status(400).json({ error: 'text missing' })
    }
    if (body.title === undefined) {
        return response.status(400).json({ error: 'title missing' })
    }
    if (body.module === undefined) {
        return response.status(400).json({ error: 'module missing' })
    }
    if (body.category === undefined) {
        return response.status(400).json({ error: 'category missing' })
    }
    if (body.page === undefined) {
        return response.status(400).json({ error: 'page missing' })
    }

    if(body.imageUrl === ''){
        const ticket = new Ticket({
            title: body.title,
            text: body.text,
            status: 'added',
            module: body.module,
            category: body.category,
            page: body.page,
            date: new Date(),
            editor: 'none',
            user: user._id,
        })

        const savedTicket = await ticket.save()
        user.tickets = user.tickets.concat(savedTicket._id)
        await user.save()

        response.json(savedTicket)
    } else{
        const ticket = new Ticket({
            title: body.title,
            text: body.text,
            status: 'added',
            module: body.module,
            category: body.category,
            page: body.page,
            date: new Date(),
            attachments: body.imageUrl,
            editor: 'none',
            user: user._id,
        })

        const savedTicket = await ticket.save()
        user.tickets = user.tickets.concat(savedTicket._id)
        await user.save()

        response.json(savedTicket)
    }
})

ticketsRouter.put('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    const body = request.body

    if(user.role === 'admin'){
        const filter = { ticketNumber: request.params.id };
        const update = {
            title: body.title,
            text: body.text,
            status: body.status,
            module: body.module,
            category: body.category,
            page: body.page,
            editor: body.editor,
        }

        await Ticket.findOneAndUpdate(filter, update, {new: true})
            .then(updatedTicket => {
                response.json(updatedTicket)
            })

    } else if(user.role === 'student'){
        return response.status(401).json({ error: 'no permission' })
    }

})

ticketsRouter.get('/attachment/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    const ticketUser = await Ticket
        .find({ticketNumber: request.params.id}).populate('user')

    if(user.role === 'admin' || user.email === ticketUser[0].user.email) {
        const ticket = await Ticket
            .find({ticketNumber: request.params.id})

        response.json(ticket[0].attachments)
    }

})

ticketsRouter.put('/attachment/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const imageUrl = request.body.imageUrl

    const user = await User
        .findById(userId)

    const ticketUser = await Ticket
        .find({ticketNumber: request.params.id}).populate('user')

    if(user.role === 'admin' || user.email === ticketUser[0].user.email) {
        const ticket = await Ticket
            .findOneAndUpdate({ticketNumber: request.params.id},
                {$push: {attachments: imageUrl}})

        response.json(ticket)
    }
})

ticketsRouter.get('/comment/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    const ticketUser = await Ticket
        .find({ticketNumber: request.params.id}).populate('user')

    if(user.role === 'admin' || user.email === ticketUser[0].user.email) {
        const ticket = await Ticket
            .find({ticketNumber: request.params.id})

        response.json(ticket[0].comments)
    }
})

ticketsRouter.put('/comment/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = jwt.decode(request.token, process.env.SECRET).id
    if (!userId) {
        return response.status(401).json({ error: 'user not found' })
    }

    const user = await User
        .findById(userId)

    const ticketUser = await Ticket
        .find({ticketNumber: request.params.id}).populate('user')

    if(user.role === 'admin' || user.email === ticketUser[0].user.email) {
        const comment = request.body.comment
        const date = new Date()

        const object = {
            comment: comment,
            email: user.email,
            commentDate: date
        }

        const ticket = await Ticket
            .findOneAndUpdate({ticketNumber: request.params.id},
                {$push: {comments: object}})

        response.json(ticket)
    }
})

module.exports = ticketsRouter