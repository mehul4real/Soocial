const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    pic:{
        type: String,
        default:"https://res.cloudinary.com/cloud1998/image/upload/v1611893784/default_jjkye5.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    notifications:[
        {
            type:String,
            by:{type:ObjectId,ref:"User"},
        }
    ]
})

mongoose.model("User", userSchema)

