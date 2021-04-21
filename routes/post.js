const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User") 

router.get('/allpost',requireLogin,(req, res)=>{
    Post.find()//finda all post
    //.populate("postedBy")//will populate all feilds including password
    .populate("postedBy","_id name")//will populate specific feilds
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")// - used to reverse sort, createdAt-> automatically created as timestamp was set as true 
    .then(posts => {
        // console.log(posts)
        posts = posts.filter(post=> {            
            return post.viewers[0] === undefined || post.viewers.includes(req.user._id)
        })
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/getsubspost',requireLogin,(req, res)=>{
    Post.find({postedBy:{$in:req.user.following}})//finda all post
    //.populate("postedBy")//will populate all feilds including password
    .populate("postedBy","_id name")//will populate specific feilds
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        //console.log(posts)
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title, body, url, viewers} = req.body
    if(!title || !body || !url){
        return res.status(422).json({error: "Please add all feilds."})
    }
    req.user.password = undefined//prevent system from storing password in postedBy field
    const post = new Post({
        title,
        body,
        photo:url,
        postedBy: req.user,
        viewers,
    })
    post.save().then(result =>{
        res.json({post: result})
    }).catch(err =>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})//if key and value are same we can directly write one thing
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id},        
    },{
        new:true    
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true //this will make mongoDB return us new record
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router