import React, { useState, useEffect } from 'react';
import Nav from '../components/nav';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/postedQuestions`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handlePost = async () => {
    if (!selectedCategory || !questionText.trim() || !tagline.trim()) {
      alert("Please select a category and fill out both question and tagline!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/postQuestion`, {
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
      } else {
        console.error('Failed to post question');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleViewAnswer = (question) => {
    navigate('/postedSolutions', { state: { question } });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 font-sans">
      <Nav />
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-row gap-6 mt-10">

          {/* Left: Ask a Question */}
          <div className="w-2/3 bg-white p-8 rounded-3xl shadow-md border border-gray-200 h-[600px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ask your Questions and Doubts!</h2>

            {!showQuestionInput ? (
              <>
                <p className="text-gray-600 mb-4">Select a category to begin:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
                  {[
                    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
                    { name: 'DSA', icon: '🧠' },
                    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
                    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
                    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
                    { name: 'Others', icon: '✨' }
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setShowQuestionInput(true);
                      }}
                      className="bg-white hover:bg-pink-100 focus:ring-2 focus:ring-pink-400 text-gray-800 px-4 py-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg flex flex-col items-center justify-center gap-2 transition-all duration-300 focus:outline-none"
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
              </>
            ) : (
              <div className="space-y-5">
                <p className="text-gray-700">
                  Selected Category: <span className="font-semibold">{selectedCategory}</span>
                  <button
                    onClick={() => setShowQuestionInput(false)}
                    className="ml-6 bg-[#FF006E] text-white px-4 py-2 rounded hover:bg-pink-400 text-sm"
                  >
                    Change
                  </button>
                </p>

                <textarea
                  placeholder="Write your question clearly..."
                  className="w-full h-40 p-4 rounded-lg bg-pink-50 border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                ></textarea>

                <input
                  type="text"
                  placeholder="Add a tagline for your question"
                  className="w-full h-20 p-3 rounded-lg bg-pink-50 border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />

                <button
                  onClick={handlePost}
                  className="bg-[#2A9D8F] text-white px-6 py-3 rounded-full hover:bg-[#21867A] text-lg font-semibold transition-all duration-300"
                >
                  Post Question
                </button>
              </div>
            )}
          </div>

          {/* Right: Posted Questions */}
          <div className="w-1/3 bg-white p-6 rounded-3xl shadow-md border border-gray-200 h-[600px] overflow-y-auto">
            <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-6">
              Posted Questions – {questions.length}
            </div>

            {questions.length === 0 ? (
              <p className="text-gray-400 text-sm">No questions posted yet.</p>
            ) : (
              <div className="space-y-5">
                {questions.map((question, index) => (
                  <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Category:</strong> {question.category}
                    </p>
                    <p className="text-gray-800 font-medium line-clamp-3">{question.question}</p>
                    <button
                      className="mt-2 text-teal-600 text-sm font-semibold hover:underline"
                      onClick={() => handleViewAnswer(question)}
                    >
                      ➜ View Answers
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
