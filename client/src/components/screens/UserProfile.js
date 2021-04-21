import React,{useContext, useEffect, useState} from 'react';
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile = ()=>{
    const [userPics, setUserPics]= useState([])
    const [userDetails, setUserDetails]= useState([])
    const [userProfile,setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userId):true)
    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            // setUserPics(result.posts)
            // setUserDetails(result.user)
            setProfile(result)

        })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userId
            })
        }).then(res=>res.json())
        .then(data=>{    
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            
            setShowFollow(true)
        })
    }


    return(
        <>{userProfile?
            <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display:'flex',
                justifyContent:'space-around',
                margin:"18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                    src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <div style={{display:'flex', justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {showfollow?
                    <button 
                        className="btn waves-effect waves-light #64b5f6 blue darken-2"
                        onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    :
                    <button 
                        className="btn waves-effect waves-light #64b5f6 blue darken-2"
                        onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map(items=>{
                        return(    
                            <img key={items._id} className="item" src={items.photo} alt={items.title}/>
                        )
                    })
                }
            </div>
        </div>
        :
        <h2>loading!...</h2>
        }</>
        
    )
}

export default Profile;