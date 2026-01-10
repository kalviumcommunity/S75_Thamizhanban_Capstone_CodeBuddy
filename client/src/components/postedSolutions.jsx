import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from './nav';
import { Star, MessageCircle, Send, ChevronDown, ChevronUp, ArrowLeft, User } from 'lucide-react';
import { io } from 'socket.io-client';

const PostedSolutions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { question } = location.state;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [inputMessages, setInputMessages] = useState({});
  const userEmail = localStorage.getItem('email');
  const username = userEmail ? userEmail.split('@')[0] : 'Anonymous';
  const socket = useRef(null);
  const chatEndRef = useRef({});

  useEffect(() => {
    socket.current = io(`https://s75-thamizhanban-capstone-codebuddy.onrender.com`);

    const fetchAnswers = async () => {
      try {
        const res = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/allAnswers/${question._id}`);
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
      const res = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/chat/${answerId}`);
      const data = await res.json();
      setChatMessages(prev => ({ ...prev, [answerId]: data }));
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  const handleRating = async (answerId, ratingValue) => {
    try {
      await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/rate/${answerId}`, {
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
        await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
      } catch (err) {
        console.error('Failed to send message:', err);
      }

      setTimeout(() => {
        chatEndRef.current[answerId]?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E12] text-gray-100">
      <Nav />
      
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Problems</span>
        </button>

        {/* Question Header */}
        <div className="bg-[#13171D] rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            {question.category && (
              <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30">
                {question.category}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{question.question}</h1>
          {question.tagline && (
            <p className="text-sm text-gray-500">#{question.tagline}</p>
          )}
        </div>

        {/* Answers Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {/* Answers List */}
        {answers.length === 0 ? (
          <div className="bg-[#13171D] rounded-xl border border-white/10 p-12 text-center">
            <MessageCircle className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-2">No answers yet</p>
            <p className="text-gray-600 text-sm">Be the first to answer this question!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map((ans, index) => (
              <div key={ans._id} className="bg-[#13171D] rounded-xl border border-white/10 overflow-hidden">
                {/* Answer Header */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <User size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {ans.author || 'Anonymous'}
                      </h3>
                      <p className="text-xs text-gray-500">Solution #{index + 1}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Rate this answer:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`cursor-pointer transition-all ${
                            star <= (ans.rating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-600 hover:text-gray-500'
                          }`}
                          size={20}
                          onClick={() => handleRating(ans._id, star)}
                        />
                      ))}
                      {ans.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          {ans.rating.toFixed(1)}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Answer Button */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {expandedIndex === index ? (
                      <>
                        <ChevronUp size={16} />
                        <span>Hide Answer</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span>View Answer</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Answer Content */}
                {expandedIndex === index && (
                  <div className="border-t border-white/10">
                    {/* Answer Text */}
                    <div className="p-6 bg-[#0A0E12]">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {ans.answer}
                      </pre>
                    </div>

                    {/* Chat Section */}
                    <div className="p-6 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle size={18} className="text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-400">
                          Discussion ({(chatMessages[ans._id] || []).length})
                        </h4>
                      </div>

                      {/* Chat Messages */}
                      <div className="bg-[#0A0E12] rounded-lg border border-white/10 p-4 h-64 overflow-y-auto mb-4 space-y-3">
                        {(chatMessages[ans._id] || []).length === 0 ? (
                          <p className="text-center text-gray-600 text-sm mt-8">
                            No messages yet. Start the discussion!
                          </p>
                        ) : (
                          (chatMessages[ans._id] || []).map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                                  msg.sender === username
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#13171D] text-gray-200 border border-white/10'
                                }`}
                              >
                                <p className="text-xs font-semibold mb-1 opacity-80">
                                  {msg.sender}
                                </p>
                                <p className="text-sm">{msg.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={(el) => chatEndRef.current[ans._id] = el} />
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputMessages[ans._id] || ''}
                          onChange={(e) =>
                            setInputMessages(prev => ({ ...prev, [ans._id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage(ans._id)}
                          placeholder="Ask a doubt or discuss..."
                          className="flex-1 px-4 py-2 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-100 placeholder-gray-600"
                        />
                        <button
                          onClick={() => sendMessage(ans._id)}
                          disabled={!inputMessages[ans._id]?.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedSolutions;