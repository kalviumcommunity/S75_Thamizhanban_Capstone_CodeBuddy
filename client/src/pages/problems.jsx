import React, { useEffect, useState } from 'react';
import Nav from '../components/nav';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Edit3, Code2 } from 'lucide-react';

const Problems = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const categories = [
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
      const response = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/allQuestions`, {
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
    <div className="min-h-screen bg-[#0A0E12] text-gray-100">
      <Nav />

      <div className="max-w-screen-2xl mx-auto px-6 pt-24 pb-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search questions by keyword..."
              className="w-full pl-12 pr-4 py-3 bg-[#13171D] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <aside className="w-72 shrink-0">
            <div className="bg-[#13171D] rounded-xl border border-white/10 p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Filter by Category
              </h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
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
                      <span className="text-m font-semibold">{cat.name}</span>
                  </button>
                ))}
              </div>
              
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </aside>

          {/* Main Content - Questions List */}
          <main className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">
                {selectedCategory ? `${selectedCategory} Questions` : 'All Questions'}
              </h1>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md text-sm font-medium border border-blue-500/30">
                {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Question' : 'Questions'}
              </span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-[#13171D] rounded-xl border border-white/10 p-12 text-center">
                <Code2 className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 text-lg mb-2">No questions found</p>
                <p className="text-gray-600 text-sm">
                  {searchText ? 'Try a different search term' : 'Be the first to ask a question!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[#13171D] rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs font-medium">
                            {q.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {q.question}
                        </h3>
                        {q.tagline && (
                          <p className="text-sm text-gray-500">#{q.tagline}</p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleViewAnswer(q)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all text-sm font-medium"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handlePostAnswer(q)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit3 size={16} />
                          <span>Answer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Problems;