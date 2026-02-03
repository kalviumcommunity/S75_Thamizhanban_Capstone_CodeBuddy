import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Problems from './pages/problems';
import Profile from './pages/profile';
import About from './pages/about'; // Import About Page
import Nav from './components/nav';
import PostAnswer from './components/postAnswer';
import PostedSolutions from './components/postedSolutions';

import './App.css';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext.jsx';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0E12] text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes - Standalone */}
        <Route path='/login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />

        {/* Protected / App Routes - Wrapped in Layout */}
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path='/' element={<Home />} />
          <Route path='/problems' element={<Problems />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/postAnswer' element={<PostAnswer />} />
          <Route path='/postedSolutions' element={<PostedSolutions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;