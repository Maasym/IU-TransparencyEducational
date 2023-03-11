const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticket");

usersRouter.get('/', async (request, response) => {
    const user = await User
        .find({role: "admin"})

    response.json(user)

})

usersRouter.post('/', async (request, response) => {
    const { email, password } = request.body
    const role = 'student'

    if (email !== "" && password.length >= 5) {
        let atpos = email.indexOf("@");
        let domain = email.split("@")[1];

        if ((atpos >= 1 && domain === 'iu-study.org') || (atpos >= 1 && domain === 'iubh-fernstudium.de')) {
            const saltRounds = 10
            const passwordHash = bcrypt.hashSync(password, saltRounds)

            const user = new User({
                email,
                passwordHash,
                role,
            })

            const savedUser = await user.save()

            response.status(201).json(savedUser)
        }
        else {
            response.status(400).send({ error: 'make sure a valid email is entered and password has at least 5 characters' })
        }
    } else{
        response.status(400).send({ error: 'make sure a valid email is entered and password has at least 5 characters' })
    }

})

module.exports = usersRouter