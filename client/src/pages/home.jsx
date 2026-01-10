import React, { useState, useEffect } from 'react';
import { MessageSquare, Code2, Sparkles, ChevronRight, Bot, X, Send, Copy, Check } from 'lucide-react';
import Nav from '../components/nav';

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

const categories =[
                      { name: 'Python',icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'  },
                      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
                      { name: 'DSA', icon: '🧠' },
                      { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
                      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
                      { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
                      { name: 'Others', icon: '✨' }
                  ]

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
            <pre className="bg-[#13171D] p-4 overflow-x-auto">
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
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans">
      {/* Header */}
  <header className="sticky top-0 z-40  bg-[#0F1115]/80 backdrop-blur">
   <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-6 py-4">
    <Nav/>

   
    
  </div>
</header>


      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="w-72 shrink-0">
            <div className="bg-[#13171D] rounded-xl border border-white/10 p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setShowQuestionInput(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-blue-600/20 border-l-2 border-blue-500 text-white'
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
          <main className="flex-1 min-w-0">
            <div className="bg-[#13171D] rounded-xl border mt-8 border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-500" size={24} />
                <h2 className="text-2xl font-bold">Ask a Question</h2>
              </div>




              {!showQuestionInput ? (
                <div className="text-center py-12">
                  <Sparkles className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400 text-lg mb-2">Select a category to get started</p>
                  <p className="text-gray-600 text-sm">Choose from the categories on the left</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Category:</span>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md text-sm font-medium border border-blue-500/30">
                        {selectedCategory}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowQuestionInput(false);
                        setSelectedCategory('');
                      }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Change Category
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Question Title</label>
                    <input
                      type="text"
                      placeholder="e.g., How to reverse a linked list?"
                      className="w-full px-4 py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Question</label>
                    <textarea
                      placeholder="Provide context, what you've tried, and what specific help you need..."
                      className="w-full h-40 px-4 py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 resize-none"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    onClick={handlePost}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    Post Question
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>


                          <button
      onClick={() => setShowAIChat((prev) => !prev)}
      className="
        flex items-center gap-3 rounded-lg z-50 border border-white/10 bg-[#1263de]  px-20 py-2 mt-4 ml-62 text-sm font-medium text-white transition hover:border-white/20 hover:bg-[#70a6fc]"
    >
      <Bot size={16} />
      <span>AI Assistant</span>
    </button>
          </main>

          {/* Right Sidebar - Questions Feed */}
          <aside className="w-96 shrink-0">
            <div className="bg-[#13171D] rounded-xl border border-white/10 p-6 sticky top-24 mt-8 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Recent Questions</h3>
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
                  {questions.length}
                </span>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">No questions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#0A0E12] border border-white/5 rounded-lg hover:border-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs font-medium">
                          {q.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-200 mb-1 line-clamp-2 group-hover:text-white transition-colors">
                        {q.tagline || q.question}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{q.question}</p>
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                        View Answers
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* AI Chat Overlay */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13171D] border border-white/10 rounded-xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
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

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0A0E12] border border-white/10'
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
                  <div className="bg-[#0A0E12] border border-white/10 rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about code, algorithms, debugging..."
                  className="flex-1 px-4 py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                />
                <button
                  onClick={handleAIChat}
                  disabled={!aiInput.trim() || isAiLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;