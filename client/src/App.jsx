import React from 'react';
import {Router,BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Problems from './pages/problems';
import Profile from './pages/profile';
import Nav from './components/nav';
import PostAnswer from './components/postAnswer';
import PostedSolutions from './components/postedSolutions';


import './App.css';

const App = () => {
  return (
   
      <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/problems' element={<Problems/>}/>
        
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/postAnswer' element={<PostAnswer/>}/>
        <Route path='/postedSolutions' element={<PostedSolutions/>}/>
        
   </Routes>
      </BrowserRouter>
      
    
  );
}

export default App;