const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 5000;
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

//database connections
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'dinosaur-facts'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//app.uses that are needed
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//sending responses
app.get(('/'), (req, res) => {
    db.collection('facts').find().toArray()
    .then(data => {
        res.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/facts', (req, res) => {
    db.collection('facts').insertOne(req.body)
    .then(result => {
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

//Checking to see if it connects to port and then displaying in console
app.listen( process.env.PORT || PORT, () =>{
    console.log(`Listening on Port ${PORT}`);
})