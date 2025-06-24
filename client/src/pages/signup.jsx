import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

  const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPass(e.target.value);

  const handleLoginNav = () => navigate('/login');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Signup Successful!');
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/'), 1000);
        setEmail('');
        setPass('');
      } else {
        setMessage(data.message || 'Signup Failed');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] font-[Segoe UI]">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white px-10 py-20 rounded-xl shadow-lg text-center"
      >
        <h1 className="text-[28px] font-bold mb-8">Sign Up Now</h1>

        <div className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={handleEmail}
            placeholder="Your email"
            className="py-3 px-6 rounded-full border border-gray-300 text-base outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={handlePassword}
            placeholder="Your password"
            className="py-3 px-6 rounded-full border border-gray-300 text-base outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full text-base font-semibold transition-colors mb-4"
        >
          Create New account
        </button>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-400 text-sm">or</span>
        </div>

        

        <p className="text-sm text-gray-500">
          Do you have an Account?
          <span
            onClick={handleLoginNav}
            className="ml-1 text-black font-medium cursor-pointer underline"
          >
            Sign In
          </span>
        </p>

        {message && (
          <p className="mt-5 text-green-600 text-sm font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;
