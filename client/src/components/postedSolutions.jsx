/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './nav';
import { FaStar } from 'react-icons/fa';
import { io } from 'socket.io-client';

const PostedAnswers = () => {
  const location = useLocation();
  const { question } = location.state;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [inputMessages, setInputMessages] = useState({});
  const userEmail = localStorage.getItem('email');
  const username = userEmail ? userEmail.split('@')[0] : 'Anonymous';
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/allAnswers/${question._id}`);
        const data = await res.json();
        setAnswers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch answers:', err);
      }
    };

    fetchAnswers();

    socket.current.on('receiveMessage', (msg) => {
      setChatMessages(prev => ({
        ...prev,
        [msg.AnswerId]: [...(prev[msg.AnswerId] || []), msg]
      }));
    });

    return () => {
      if (expandedIndex !== null && answers[expandedIndex]) {
        socket.current.emit('leaveRoom', answers[expandedIndex]._id);
      }
      socket.current.disconnect();
    };
  }, [question._id]);

  const fetchChatMessages = async (answerId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/chat/${answerId}`);
      const data = await res.json();
      setChatMessages(prev => ({ ...prev, [answerId]: data }));
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  const handleRating = async (answerId, ratingValue) => {
    try {
      await fetch(`http://localhost:3000/api/rate/${answerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue })
      });

      setAnswers(prev =>
        prev.map(ans =>
          ans._id === answerId
            ? { ...ans, rating: ratingValue }
            : ans
        )
      );
    } catch (err) {
      console.error('Failed to rate answer:', err);
    }
  };

  const toggleExpand = (index) => {
    const currentAnswer = answers[index];
    const previousAnswer = answers[expandedIndex];

    if (expandedIndex !== null && previousAnswer) {
      socket.current.emit('leaveRoom', previousAnswer._id);
    }

    if (index !== expandedIndex) {
      socket.current.emit('joinRoom', currentAnswer._id);
      fetchChatMessages(currentAnswer._id);
      setExpandedIndex(index);
    } else {
      setExpandedIndex(null);
    }
  };

  const sendMessage = async (answerId) => {
    const messageText = inputMessages[answerId];
    if (messageText && messageText.trim()) {
      const newMessage = { sender: username, text: messageText, AnswerId: answerId };

      socket.current.emit('sendMessage', newMessage);

      setInputMessages(prev => ({ ...prev, [answerId]: '' }));
      setChatMessages(prev => ({
        ...prev,
        [answerId]: [...(prev[answerId] || []), newMessage]
      }));

      try {
        await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      <Nav />
      <div className="flex flex-col mt-24 items-center px-6">
        <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Answers for: <span className="text-pink-500">{question.question}</span>
        </h2>

        <div className="w-full max-w-5xl space-y-10">
          {answers.length === 0 ? (
            <div className="text-center text-gray-600 text-lg bg-white rounded-xl py-10 shadow border border-gray-200">
              🚫 No answers found for this question yet.
            </div>
          ) : (
            answers.map((ans, index) => (
              <div key={ans._id} className="bg-white rounded-3xl shadow-md px-6 py-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-pink-400 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow">
                    {ans.author ? ans.author.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {ans.author || 'User'}'s Answer {index + 1}
                  </h3>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-500 text-sm">Click to {expandedIndex === index ? 'hide' : 'view'} this answer</p>
                  <button
                    onClick={() => toggleExpand(index)}
                    className="text-pink-600 hover:underline text-sm"
                  >
                    {expandedIndex === index ? 'Hide Answer ▲' : 'Show Answer ▼'}
                  </button>
                </div>

                {expandedIndex === index && (
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap mb-4 border border-gray-200 shadow-inner">
                    {ans.answer}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Rate this answer:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer text-lg transition ${
                          star <= (ans.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(ans._id, star)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Doubt Discussion</h4>
                  <div className="bg-pink-50 rounded-lg p-3 h-56 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-pink-300">
                    {(chatMessages[ans._id] || []).map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`px-4 py-2 rounded-xl text-white text-sm max-w-[75%] ${
                          msg.sender === username ? 'bg-pink-500' : 'bg-pink-300'
                        }`}>
                          <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-3 gap-2">
                    <input
                      type="text"
                      value={inputMessages[ans._id] || ''}
                      onChange={(e) =>
                        setInputMessages(prev => ({ ...prev, [ans._id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(ans._id)}
                      placeholder="Ask a doubt..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => sendMessage(ans._id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedAnswers;
