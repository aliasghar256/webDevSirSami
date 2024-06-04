const express = require('express')
const mainRouter = require('./routers/mainRouter')
const mongoose = require('mongoose')
const port = 3001
const app = express()
const cors = require('cors')
mongoose.connect("mongodb://localhost:27017/PakistanLawLibraryDBTesting")
    .then(() => {
        console.log('DB Connected successfully.')
    })
    .catch((err) => {
        console.log('Error in DB Connection', err)
    })


app.use((req, res, next) => {
    console.log('HTTP Method: ', req.method, " URL: ", req.url)
    next()
})
app.use(express.json())
app.use(cors())

app.use('/', mainRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})