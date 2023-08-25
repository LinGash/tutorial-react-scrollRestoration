import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLists />,
      // children: [
      //   {
      //     path: "userDetails",
      //     element: <UserDetails />
      //   },
      // ],
    },
    {
      path: "/userDetails",
      element: <UserDetails />,
    },
  ]);

  return (
    // <BrowserRouter>
    //  <Routes>
    //    <Route path="/" element={<UserLists />}/>
    //    <Route path="/userDetails" element={<UserDetails />}/>
    //  </Routes>
    // </BrowserRouter>
     <RouterProvider router={router} />
  );
}

const UserLists = () => {
  const location =  useLocation();
  const [data,setData] = useState([]);
  const [scrollPosition,setScrollPosition] = useState();
  const navigate = useNavigate();
  const scrollRef = useRef();

  useEffect(()=> {
    if(location.state){
      const {userLists,scrollPosition} = location.state;  
      setData(userLists)
      scrollRef.current.style.backgroundColor = 'red'
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollPosition
      }, (10));
    }else{
      getDataFromApi();
    }
  },[])


  const getDataFromApi = async () => {
    try{
      const res = await axios.get('https://reqres.in/api/users');
      setData(res.data.data);
    }catch(err){
      console.log("error",err)
    }     
  }

  const handleScroll = (event) => {
    setScrollPosition(event.target.scrollTop)
  }

  return (
    <div className="App">
      {/* <ScrollRestoration
       getKey={(location, matches) => {
        return location.pathname;
      }}
      /> */}
      <div style={{overflowY: "scroll",height: '100vh'}} ref={scrollRef} onScroll={handleScroll}>
        {data.map((info) => {
          return (
            <div
              style={{backgroundColor: "orange"}}
              onClick={() => {
                navigate('/userDetails',{state: {userLists: data,scrollPosition,userInfo: info},preventScrollReset: true})
              }}
            >
              <h2>{info.email}</h2>
              <h2>{info.first_name}</h2>
              <h2>{info.last_name}</h2>
              <img src={info.avatar} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const UserDetails = () => {
  const [userInfo,setUserInfo] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  window.onpopstate = function () {
    navigate('/',{state: location.state})
  };

  useEffect(()=> {
    if(location.state){
      const {userInfo} = location.state;
      setUserInfo(userInfo)
    }
  })

  return (
    <div>
      <button
        onClick={() => {
          navigate('/',{state: location.state,preventScrollReset: true})
        }}
      >
        Go back to user lists
      </button>
      <div
        style={{ backgroundColor: "skyblue" }}
      >
        <h2>{userInfo?.email}</h2>
        <h2>{userInfo?.first_name}</h2>
        <h2>{userInfo?.last_name}</h2>
        <img src={userInfo?.avatar} />
      </div>
    </div>
  )
}

export default App;
