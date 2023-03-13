require('dotenv').config()
const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    { MongoClient } = require('mongodb'),
    bodyParser = require('body-parser');

const api = require('./routes/card.routes')

const DB_PASSWORD = process.env.DB_PASSWORD,
    DB_USERNAME = process.env.DB_USERNAME,
    DB_TABLE = process.env.DB_TABLE

console.log({ DB_PASSWORD, DB_USERNAME, DB_TABLE });

const uri = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.5yp3u.mongodb.net/${DB_TABLE}?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`

mongoose.connect(uri)
    .then((res) => console.log(`Connected to mongodb. Database name: ${res.connections[0].name}`))
    .catch((err) => console.error(`Error connecting to mongo.`, err.reason))

const app = express();
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(cors())
    .use('/public', express.static('public'))
    .use('/api', api)

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Connected to port ${port}`)
})

app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'))
    })
})
    
    .use(function (err, req, res, next) {
        console.error(err.message);
        if (!err.statusCode) err.statusCode = 500;
        res.status(err.statusCode).send(err.message)
})