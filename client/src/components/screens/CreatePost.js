import React,{useContext, useState, useEffect} from 'react';
import M from 'materialize-css';
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

const CreatePost = ()=> {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const [show,setShow]=useState([]);
    const [followers,setFollowers]=useState([]);

    /*Use Effect hook ->since we were making two API calls and one should be called only after other but that may not always happen 
    so we use this hook to check change in a value (here "url") so when url will change then only this api will be called. 
    */

    useEffect(()=>{
        fetch('/followers',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setFollowers(result.followers)
        })
    },[])

    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    url,
                    viewers: show
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }else{
                    M.toast({html: "Created Post", classes:"#388e3c green darken-2"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])
    const postDetails =()=>{        
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cloud1998")
        fetch("https://api.cloudinary.com/v1_1/cloud1998/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{
            console.log(err)
        })
    }

    const clear = (item) => {
        let new_Ar = show.filter(val => val != item)
        setShow(new_Ar)    
    }
    const add = (item) => {
        if(!show.includes(item))
            setShow([...show, item])
    }

    return (
        <>
            <div className="card input-field"
            style={{
                margin:"30px auto",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"
            }}
            >
                <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>            
                <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}/> 
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-2">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div> 
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={()=>postDetails()}>Submit Post</button>          
            </div>
            <div style={{
                margin:"30px auto",
                maxWidth:"600px",
                padding:"20px",
                textAlign:"center",
                alignContent: "center"
            }}>
                <label>Share with..</label>                
                    <div class="collection ">
                        {
                        followers.map((item)=>{
                            return (<div class="collection-item row">
                                        <div className="col">
                                        {item.name}
                                        </div>
                                        <div className=" d-flex flex-row-reverse">
                                            {show.includes(item._id)
                                            ?
                                            (<button className=" btn waves-effect waves-light #64b5f6 blue darken-2" onClick={() => clear(item._id)}>Cancle</button>)
                                            :
                                            (<button className=" btn waves-effect waves-light #64b5f6 darken-2" onClick={() => add(item._id) }>Select</button>)    
                                            }
                                            
                                            
                                        </div>
                                </div>)
                        })                        
                    }
                        
                    </div>
            
            </div>
        </>
    );
}

export default CreatePost;