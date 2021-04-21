import React,{useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data,setData]=useState([]);
    const [comment,setComment]=useState("");
    
    const {state, dispatch} = useContext(UserContext)

    //console.log(state._id)
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
    },[])
    
    const likePost=(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result.result._id)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    const unlikePost=(id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                //console.log(result.result._id)
                const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        if(text){
            fetch('/comment',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId,
                    text
                })
            }).then(res=>res.json())
            .then(result=>{

                const newData = data.map(item=>{
                    if(item._id === result._id){
                        return result
                    }else{
                        return item
                    }
                })
                setData(newData)
                setComment("")
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return(
        <div className="home">
            {
                data.map(item=>{
                    return (
                        <div key={item._id} className="card home-card">
                            <h5 style={{padding:"6px"}}><Link to={(item.postedBy._id !== state._id)?`/profile/${item.postedBy._id}`:"/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id 
                                && <i className="material-icons" style={{float:"right"}}
                                onClick={ ()=>{ deletePost(item._id)}}
                            >delete</i>
                            }</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                ? 
                                <i className="material-icons"
                                    onClick={()=>{unlikePost(item._id)}} style={{color:"red"}}
                                >favorite</i>
                                : 
                                <i className="material-icons"
                                    onClick={()=>{likePost(item._id)}}
                                >favorite_border</i>
                                }                                                         
                                <h6>{item.likes.length} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(comment, item._id)
                                    e.target=null
                                }}>
                                    <input type="text" placeholder="Add a comment!" value={comment} onChange={(e)=> setComment(e.target.value)}/>
                                </form>
                            </div>
                        </div>  
                    )
                })
            }              
        </div>
    );
}
export default Home;