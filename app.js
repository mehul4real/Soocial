const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT= process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err)=>{
    console.log("err connecting ",err)
})
app.listen(PORT, ()=>{
    console.log("server is running on", PORT)
})

require('./models/user')
require('./models/post')

app.use(express.json())// is a Middlewarwe converts all request to json
app.use(require('./routes/auth'))//Middleware, passes all request to auth.js
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


