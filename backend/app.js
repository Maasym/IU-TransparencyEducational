const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const ticketRouter = require('./controllers/tickets')
const modulesRouter = require('./controllers/module')
const categoriesRouter = require('./controllers/category')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const path = require("path");

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(express.static('build'))

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/tickets', ticketRouter)
app.use('/api/modules', modulesRouter)
app.use('/api/categories', categoriesRouter)
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '/build/')});
});

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app