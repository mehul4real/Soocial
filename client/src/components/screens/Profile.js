import React,{useContext, useEffect, useState} from 'react';
import {UserContext} from '../../App'

const Profile = ()=>{
    const [myPics, setMyPics]= useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image,setImage] = useState(undefined)
    //const [url,setUrl] = useState(undefined)
    //console.log(state)
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setMyPics(result.mypost)
        })
        console.log(state)
    },[])

    useEffect(()=>{
        if(image){const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cloud1998")
        fetch("https://api.cloudinary.com/v1_1/cloud1998/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            //setUrl(data.url)
            //console.log(data.url)
            fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
        }).catch(err=>{
            console.log(err)
        })}
    },[image])

    const updatePic=(file)=>{
        setImage(file)       
    }
    return(
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display:'flex',
                justifyContent:'space-around',
                margin:"18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                    src={state?state.pic:""}/>
                </div>
                <div>
                    <h4>{state?state.name:"loading.."}</h4>
                    <div style={{display:'flex', justifyContent:"space-between",width:"108%"}}>
                        <h6>{myPics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                    <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-2">
                        <span>Update Pic</span>
                        <input type="file" onChange={(e)=>updatePic(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPics.map(items=>{
                        return(    
                            <img key={items._id} className="item" src={items.photo} alt={items.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile;