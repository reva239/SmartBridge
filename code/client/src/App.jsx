import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import SignUp from './SignUp';
import { ContextData } from './context/context';
import { Page } from '../Page';



const App = () => {

  const [bookkings,setBooks] = useState([]);
  const [type,setType] = useState('');
  const [flights,setFlights] = useState([]);
  const [user,setUser] = useState([]);
  const [userId,setUserId] = useState([]);

  return (
   <ContextData.Provider value={
    {  bookkings,
       setBooks,
       type,
       setType,
       flights,
       setFlights,
       user,
       setUser,
       userId,
       setUserId
    }
  }>  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/page" element={<Page />} />
      </Routes>
    </BrowserRouter>
   </ContextData.Provider>
  );
};

export default App;
