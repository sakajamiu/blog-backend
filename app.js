const config = require('./utilities/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utilities/middleware')
const logger = require('./utilities/logger')
const mongoose = require('mongoose')

console.log("Database_URL", process.env.MONGODB_URI);
logger.info('connecting to :', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to database:,', error.message)
    })


app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if(process.env.NODE_ENV ==='test'){
   const testingRouter = require('./controllers/testing')
   app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app