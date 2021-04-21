const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')


router.post('/signup',(req, res)=>{
    //console.log(req.body.name)
    const {name, email,password,pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error: "please add all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exist!"})
        }
        bcrypt.hash(password,10).then(hashedpassword =>{
            const user = new User({
                name,
                email,
                password:hashedpassword,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message: "Saved Successfully!"})
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            res.json({error : err})
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/signin' , (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return req.status(422).json({error: "please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error: "Invalid Email or Password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMathch => {
            if(doMathch){
                //return res.json({message:"successfully signed in"})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                return res.json({token, user:{_id,name,email,followers, following, pic}})
            }else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        }).catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router