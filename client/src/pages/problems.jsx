import React, { useEffect, useState } from 'react';
import Nav from '../components/nav';
import { useNavigate } from 'react-router-dom';
import { SiPython, SiJavascript, SiCplusplus, SiLeetcode } from "react-icons/si"

const Problems = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(`https://codebuddy-4-78bo.onrender.com/api/allQuestions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchData();
  }, []);

const filteredQuestions = questions.filter((q) => {
  const matchesCategory = selectedCategory ? q.category === selectedCategory : true;
  const matchesSearch = (q.question?.toLowerCase() || "").includes(
    (searchText || "").toLowerCase()
  );
  return matchesCategory && matchesSearch;
});


  const handlePostAnswer = (question) => {
    navigate('/postAnswer', { state: { question } });
  };

  const handleViewAnswer = (question) => {
    navigate('/postedSolutions', { state: { question } });
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-r from-pink-100 to-blue-100 font-sans">
      <Nav />

      <div className="mt-20 px-10 flex justify-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search questions..."
          className="w-full max-w-3xl px-6 py-3   rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-400 shadow-lg text-gray-700 placeholder-gray-500 text-sm"
        />
      </div>


      <div className="flex flex-row p-10 gap-10 w-full max-w-8xl mx-auto mt-10">

       <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-200 flex flex-col gap-6 min-w-[250px] max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
  <h2 className="text-lg font-bold text-gray-700 mb-2 text-center">Languages</h2>
  {[
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'DSA', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Others', icon: '✨' }
  ].map((cat) => (
    <button
      key={cat.name}
      onClick={() => setSelectedCategory(cat.name)}
      className={`flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-gray-100 transition ${
        selectedCategory === cat.name ? 'bg-gray-200' : ''
      }`}
    >
      {typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
        <img src={cat.icon} alt={cat.name} className="w-8 h-8" />
      ) : (
        <span className="text-2xl">{cat.icon}</span>
      )}
      <span>{cat.name}</span>
    </button>
  ))}
  {selectedCategory && (
    <button
      className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full transition"
      onClick={() => setSelectedCategory('')}
    >
      Show All
    </button>
  )}
</div>


        <div className="flex-1 flex flex-col gap-6 pr-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex justify-between items-center transition-all"
            >
              <div>
                <p className="text-sm text-pink-500 font-semibold mb-1">{q.category}</p>
                <h4 className="text-lg font-bold text-gray-800">{q.question}</h4>
                <p className="text-sm text-gray-600 mt-1">#{q.tagline}</p>
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-[#2A9D8F] hover:bg-[#21867A] text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  onClick={() => handleViewAnswer(q)}
                >
                  View Answers
                </button>
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  onClick={() => handlePostAnswer(q)}
                >
                  Post Answer
                </button>
              </div>
            </div>
          ))}
          {filteredQuestions.length === 0 && (
            <p className="text-center text-gray-600">No questions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
