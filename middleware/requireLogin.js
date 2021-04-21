const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User") 

module.exports = (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        res.status(401).json({error:"You must log in first"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET,(err, payload)=>{
        if(err){
            return res.status(401).json({error: "you must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        //next()//here abobe callbak function may take some time so we'll get undefined in data 
        //thus we'll write next() in same fun.
    })

}