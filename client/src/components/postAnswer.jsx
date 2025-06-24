/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Nav from './nav';
import { useLocation } from 'react-router-dom';

const PostAnswer = () => {
  const [Answer, setAnswer] = useState('');
  const location = useLocation();
  const question = location.state?.question;
  const token = localStorage.getItem('token');
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL
  const postAnswer = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/postAnswer`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          answer: Answer,
          question: question._id 
        })
      });
  
      if (response.ok) {
        setAnswer('');
        console.log('Answer posted!');
        alert("Answer successfully posted!");
      } else {
        const error = await response.json();
        console.log('Failed to post answer:', error.message);
      }
  
    } catch (err) {
      console.log("Error:", err.message);
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-pink-100 to-blue-100 min-h-screen font-sans">
      <Nav />

      {/* Center Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-300">
          <h3 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
             Share Your Solution
          </h3>
          <p className="text-xl text-gray-700 font-medium mb-8 text-center">
            {question?.question}
          </p>

          <textarea
            placeholder="Type your awesome answer here..."
            className="w-full h-60 p-5 text-lg rounded-xl bg-pink-50 border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
            value={Answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>

          <div className="flex justify-end mt-6">
            <button
              className="bg-[#2A9D8F] hover:bg-[#21867A] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
              onClick={postAnswer}
            >
             Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAnswer;
