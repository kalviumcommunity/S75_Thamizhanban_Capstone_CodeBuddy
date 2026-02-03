import React, { useState, useEffect } from 'react';
// Added new icons: Zap, Users, Trophy, TrendingUp, Activity
import { MessageSquare, Code2, Sparkles, ChevronRight, Bot, X, Send, Copy, Check, Zap, Users, Trophy, TrendingUp, Activity } from 'lucide-react';
// Nav handled by Layout

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Mock token for demo - replace with actual auth
  const token = localStorage.getItem('token') || 'demo-token';

  const categories = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'DSA', icon: '🧠' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Others', icon: '✨' }
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/postedQuestions`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  const handlePost = async () => {
    if (!selectedCategory || !questionText.trim() || !tagline.trim()) {
      alert("Please select a category and fill out both question and tagline!");
      return;
    }

    try {
      const response = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/postQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: questionText,
          tagline: tagline,
          category: selectedCategory
        }),
      });

      if (response.ok) {
        setQuestionText('');
        setTagline('');
        fetchData();
        setShowQuestionInput(false);
        setSelectedCategory('');
      }
    } catch (err) {
      console.error('Failed to post question:', err);
    }
  };

  const handleAIChat = async () => {
    if (!aiInput.trim()) return;

    setIsAiLoading(true);

    const userMessage = {
      role: "user",
      content: aiInput,
    };

    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");

    try {
      const response = await fetch(
        `https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/ai/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: aiInput }),
        }
      );

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      setAiMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI Error:", err);
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderMessageContent = (content, messageIndex) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let codeBlockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim(),
        index: `${messageIndex}-${codeBlockIndex}`
      });
      lastIndex = match.index + match[0].length;
      codeBlockIndex++;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="my-3 rounded-lg overflow-hidden border border-white/10">
            <div className="flex items-center justify-between bg-[#0A0E12] px-3 py-2 border-b border-white/10">
              <span className="text-xs text-gray-400 font-mono">{part.language}</span>
              <button
                onClick={() => copyCode(part.content, part.index)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedCode === part.index ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#13171D]/50 p-4 overflow-x-auto">
              <code className="text-sm text-gray-300 font-mono">{part.content}</code>
            </pre>
          </div>
        );
      }
      return <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-wrap">{part.content}</p>;
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans relative overflow-hidden">

      {/* --- BACKGROUND ANIMATION LAYER --- */}
      {/* Background handled by Layout */}

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10">


        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left Sidebar - Categories */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setShowQuestionInput(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedCategory === cat.name
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-2 border-blue-500/50 text-white'
                          : 'hover:bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                      {cat.icon.startsWith('http') ? (
                        <img src={cat.icon} alt={cat.name} className="w-10 h-10" />
                      ) : (
                        <span className="text-3xl">{cat.icon}</span>
                      )}
                      <span className="text-sm font-semibold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="w-full lg:flex-1 min-w-0">
              <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border mt-0 sm:mt-8 border-white/10 p-4 sm:p-8 shadow-2xl relative overflow-hidden">

                <div className="flex items-center gap-2 sm:gap-3 mb-6 relative z-10">
                  <MessageSquare className="text-blue-500" size={20} />
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {showQuestionInput ? "Ask a Question" : "Welcome Back"}
                  </h2>
                </div>

                {!showQuestionInput ? (
                  <div className="py-1 relative z-10">
                    {/* Hero Section of Empty State */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-white bg-clip-text text-transparent mb-3 sm:mb-5">
                        Ready to code something amazing?
                      </h1>
                      <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
                        CodeBuddy is your community for solving complex problems, sharing knowledge, and debugging with AI assistance.
                      </p>
                    </div>

                    {/* Stats/Info Grid - Fills the empty space */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E12]/50 border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                          <Zap className="text-blue-400" size={16} />
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-semibold mb-1">Fast Answers</h4>
                        <p className="text-xs text-gray-500">Get solutions from the community or AI instantly.</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E12]/50 border border-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                          <Users className="text-purple-400" size={16} />
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-semibold mb-1">Active Peers</h4>
                        <p className="text-xs text-gray-500">Collaborate with developers worldwide.</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E12]/50 border border-white/5 hover:border-green-500/30 transition-all group">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                          <Trophy className="text-green-400" size={16} />
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-semibold mb-1">Earn Reputation</h4>
                        <p className="text-xs text-gray-500">Solve doubts and climb the leaderboards.</p>
                      </div>

                      <div className="p-3 sm:p-4 rounded-xl bg-[#0A0E12]/50 border border-white/5 hover:border-yellow-500/30 transition-all group">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                          <Bot className="text-yellow-400" size={16} />
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-semibold mb-1">AI Powered</h4>
                        <p className="text-xs text-gray-500">Stuck? Ask our AI assistant for a hint.</p>
                      </div>
                    </div>

                    {/* Call to Action with Visual Cue */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 animate-pulse">
                        <span className="text-lg sm:text-xl"></span>
                        <span className="text-xs sm:text-sm font-medium text-blue-400">Select a category to post a question</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <span className="text-gray-400 text-xs sm:text-sm">Category:</span>
                        <span className="px-2 sm:px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md text-xs sm:text-sm font-medium border border-blue-500/30 flex items-center gap-2">
                          <Activity size={12} />
                          {selectedCategory}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowQuestionInput(false);
                          setSelectedCategory('');
                        }}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Change Category
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Question Title</label>
                      <input
                        type="text"
                        placeholder="e.g., How to reverse a linked list?"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0A0E12]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 text-sm transition-all"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Detailed Question</label>
                      <textarea
                        placeholder="Provide context, what you've tried, and what specific help you need..."
                        className="w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 bg-[#0A0E12]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 text-sm resize-none transition-all"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      onClick={handlePost}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      Post Question
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAIChat((prev) => !prev)}
                className="
                  flex items-center gap-2 sm:gap-3 rounded-lg z-50 border border-white/10 bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 mt-4 sm:mt-6 text-xs sm:text-sm font-medium text-white transition-all hover:border-white/20 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Bot size={16} />
                <span>AI Assistant</span>
              </button>
            </main>

            {/* Right Sidebar - Questions Feed */}
            <aside className="w-full lg:w-96 shrink-0">
              <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6 sticky top-24 mt-0 sm:mt-8 max-h-[400px] sm:max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide">Recent Questions</h3>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <TrendingUp size={12} className="text-green-400" />
                    <span className="px-2 py-0.5 sm:py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
                      {questions.length}
                    </span>
                  </div>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-4 sm:py-8">
                    <p className="text-gray-600 text-xs sm:text-sm">No questions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {questions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-4 bg-[#0A0E12]/50 border border-white/5 rounded-lg hover:border-purple-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                          <span className="px-1.5 sm:px-2 py-0.5 bg-gray-800/50 text-gray-400 rounded text-xs font-medium border border-white/5 truncate">
                            {q.category}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-600 shrink-0">Just now</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-200 mb-0.5 sm:mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {q.tagline || q.question}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 sm:mb-3">{q.question}</p>
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5">
                          View Answers
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* AI Chat Overlay (Same as before) */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13171D]/95 backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#13171D]/50 z-10">
              <div className="flex items-center gap-3">
                <Bot className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-semibold">AI Code Assistant</h3>
                  <p className="text-xs text-gray-500">Powered by Claude</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0E12]/30 z-10">
              {aiMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Bot className="mx-auto text-gray-600 mb-3" size={48} />
                    <p className="text-gray-400 mb-2">Ask me anything about coding!</p>
                    <p className="text-gray-600 text-sm">I can help with debugging, explanations, and code examples</p>
                  </div>
                </div>
              ) : (
                aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                        <Bot size={18} className="text-blue-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-[#0A0E12]/80 border border-white/10'
                        }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <div className="text-sm space-y-2">
                          {renderMessageContent(msg.content, idx)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isAiLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Bot size={18} className="text-blue-400" />
                  </div>
                  <div className="bg-[#0A0E12]/80 border border-white/10 rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#13171D]/50 z-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about code, algorithms, debugging..."
                  className="flex-1 px-4 py-3 bg-[#0A0E12]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-white"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                />
                <button
                  onClick={handleAIChat}
                  disabled={!aiInput.trim() || isAiLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Animation Styles & Custom Scrollbar */}
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

export default Home;