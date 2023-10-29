require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conntected to Database'))

app.use(express.json()) // Lets the server accept JSON as a body instead of a post element.

const flightsRouter =require('./routes/flights')

app.use('/api/flights', flightsRouter)

app.listen(3000, () => console.log('Listening on port 3000'))
