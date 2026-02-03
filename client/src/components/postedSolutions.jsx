import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from './nav';
import { Star, MessageCircle, Send, ChevronDown, ChevronUp, ArrowLeft, User, Sparkles, HelpCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const PostedSolutions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { question } = location.state;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [inputMessages, setInputMessages] = useState({});
  // const userEmail = localStorage.getItem('email'); // Removed
  const username = user?.email ? user.email.split('@')[0] : 'Anonymous';
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
    if (!user) {
      alert("Please login to rate!");
      return;
    }
    try {
      await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/rate/${answerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans relative overflow-hidden">

      {/* --- BACKGROUND ANIMATION LAYER --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 text-blue-500/5 font-mono text-sm animate-float">
          {'// Discussion thread'}
        </div>
        <div className="absolute bottom-40 left-10 text-purple-500/5 font-mono text-sm animate-float" style={{ animationDelay: '2s' }}>
          {'solve(problem);'}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10">
        <header className="sticky top-0 z-40 bg-[#0F1115]/80 backdrop-blur-md border-b border-white/10">
          <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-6 py-4">
            <Nav />
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back to Problems</span>
          </button>

          {/* Question Header Card */}
          <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl relative overflow-hidden mb-10">
            {/* Inner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <HelpCircle size={24} />
                  </span>
                  {question.category && (
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                      {question.category}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3 leading-tight">
                  {question.question}
                </h1>
                {question.tagline && (
                  <div className="flex items-center gap-2 text-purple-400/80">
                    <Sparkles size={14} />
                    <p className="text-sm font-medium">{question.tagline}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Answers Count & Filter */}
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-500" />
              {answers.length} {answers.length === 1 ? 'Solution' : 'Solutions'}
            </h2>
          </div>

          {/* Answers List */}
          {answers.length === 0 ? (
            <div className="bg-[#13171D]/60 backdrop-blur-md rounded-xl border border-white/10 p-16 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-300 text-xl font-semibold mb-2">No solutions yet</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Be the first to crack this code! Submit your solution to help the community.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((ans, index) => (
                <div
                  key={ans._id}
                  className="bg-[#13171D]/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg hover:border-blue-500/20 transition-all duration-300"
                >
                  {/* Answer Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1px]">
                          <div className="w-full h-full bg-[#13171D] rounded-xl flex items-center justify-center">
                            <User size={24} className="text-gray-300" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {ans.author || 'Anonymous Developer'}
                          </h3>
                          <p className="text-xs text-blue-400 font-medium">Contributor</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1 justify-end">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-bold">{ans.rating ? ans.rating.toFixed(1) : '0.0'}</span>
                        </div>
                        <p className="text-xs text-gray-500">Average Rating</p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-gray-500 mr-2">Rate:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`transition-transform hover:scale-110 focus:outline-none ${star <= (ans.rating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-700 hover:text-yellow-400/50'
                              }`}
                            onClick={() => handleRating(ans._id, star)}
                          >
                            <Star size={18} fill={star <= (ans.rating || 0) ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpand(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${expandedIndex === index
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {expandedIndex === index ? (
                          <><span>Collapse</span> <ChevronUp size={16} /></>
                        ) : (
                          <><span>View Solution & Chat</span> <ChevronDown size={16} /></>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content (Code + Chat) */}
                  {expandedIndex === index && (
                    <div className="border-t border-white/10 animate-in slide-in-from-top-2 duration-300">

                      {/* Code Block */}
                      <div className="p-6 bg-[#050709]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 font-mono uppercase">Solution Code</span>
                          {/* Copy button could go here */}
                        </div>
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed bg-[#0A0E12] border border-white/5 p-4 rounded-lg overflow-x-auto">
                          {ans.answer}
                        </pre>
                      </div>

                      {/* Chat Section */}
                      <div className="bg-[#0f1216] border-t border-white/5">
                        <div className="p-4 bg-[#13171D]/50 border-b border-white/5 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <MessageCircle size={16} className="text-blue-500" />
                            Discussion Thread
                            <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-gray-400">
                              {(chatMessages[ans._id] || []).length}
                            </span>
                          </h4>
                        </div>

                        {/* Messages Area */}
                        <div className="h-72 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                          {(chatMessages[ans._id] || []).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                              <MessageCircle size={32} className="mb-2" />
                              <p className="text-sm">No comments yet. Start the discussion!</p>
                            </div>
                          ) : (
                            (chatMessages[ans._id] || []).map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.sender === username
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-[#1E2329] text-gray-200 border border-white/5 rounded-bl-none'
                                    }`}
                                >
                                  <p className="text-[10px] font-bold mb-1 opacity-70 uppercase tracking-wider">
                                    {msg.sender}
                                  </p>
                                  <p className="leading-relaxed">{msg.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                          <div ref={(el) => chatEndRef.current[ans._id] = el} />
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-4 border-t border-white/5 bg-[#13171D]/50">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={inputMessages[ans._id] || ''}
                              onChange={(e) =>
                                setInputMessages(prev => ({ ...prev, [ans._id]: e.target.value }))
                              }
                              onKeyDown={(e) => e.key === 'Enter' && sendMessage(ans._id)}
                              placeholder="Ask a question or provide feedback..."
                              className="flex-1 px-4 py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-gray-100 placeholder-gray-600 transition-all"
                            />
                            <button
                              onClick={() => sendMessage(ans._id)}
                              disabled={!inputMessages[ans._id]?.trim()}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center aspect-square"
                            >
                              <Send size={18} />
                            </button>
                          </div>
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

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PostedSolutions;