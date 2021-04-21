import React,{useEffect,createContext, useReducer, useContext} from 'react';
import "./App.css";
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'

//Components
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import {reducer, initialState} from './reducer/userReducer'
//exact is used to specify blank path otherwise / is included in all url
//Switch makes onlu one clild avtive at a time (using it is optional)
export const UserContext = createContext()


const Routing=()=>{
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      history.push('/login')
    }
  },[]) //empty effect[] means will be executed only first time on page load
  return(
    <Switch>
        <Route exact path="/">
          <Home/>        
        </Route>
        <Route path="/login">
          <Login/>        
        </Route>
        <Route path="/signup">
          <Signup/>        
        </Route>
        <Route exact path="/profile">
          <Profile/>        
        </Route>
        <Route path="/create">
          <CreatePost/>        
        </Route>
        <Route path="/profile/:userId">
          <UserProfile/>        
        </Route>
        <Route path="/myfollowingpost">
          <SubscribedUserPosts/>        
        </Route>
    </Switch>    
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value ={{state, dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
