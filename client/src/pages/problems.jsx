import React, { useEffect, useState } from 'react';
// Nav handled by Layout
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Edit3, Code2 } from 'lucide-react';

const Problems = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 relative">
      {/* Background handled by Layout */}

      <div className="relative z-10">


        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
              <Code2 className="text-blue-400" size={16} />
              <span className="text-xs sm:text-sm text-blue-400 font-medium">Community Q&A</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Explore <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Browse coding questions, share solutions, and learn together
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 sm:mb-10">
            <div className="relative max-w-3xl mx-auto">
              {/* Glow effect for search */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search questions by keyword..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#13171D] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Categories */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-[#13171D] rounded-xl border border-white/10 p-4 sm:p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Filter by Category
                </h2>
                <div className="space-y-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex flex-col sm:flex-row lg:flex-row items-center lg:items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all group/btn ${
                        selectedCategory === cat.name
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 text-white shadow-lg shadow-blue-500/20'
                          : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {cat.icon.startsWith('http') ? (
                        <img src={cat.icon} alt={cat.name} className="w-6 sm:w-8 h-6 sm:h-8 group-hover/btn:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg sm:text-2xl group-hover/btn:scale-110 transition-transform">{cat.icon}</span>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-center">{cat.name}</span>
                    </button>
                  ))}
                </div>
                
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content - Questions List */}
            <main className="w-full lg:flex-1 min-w-0">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  {selectedCategory ? (
                    <>
                      <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        {selectedCategory}
                      </span>
                      <span>Questions</span>
                    </>
                  ) : (
                    'All Questions'
                  )}
                </h1>
                <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 rounded-lg text-xs sm:text-sm font-medium border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Question' : 'Questions'}
                </span>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="bg-[#13171D]/80 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center relative overflow-hidden">
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                  <Code2 className="mx-auto text-gray-600 mb-4 relative" size={48} />
                  <p className="text-gray-400 text-lg mb-2 relative">No questions found</p>
                  <p className="text-gray-600 text-sm relative">
                    {searchText ? 'Try a different search term' : 'Be the first to ask a question!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-[#13171D]/80 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                    >
                      {/* Animated glow border on hover */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-xl animate-pulse"></div>
                      </div>
                      
                      {/* Hover sweep effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="flex items-start justify-between gap-4 relative">
                        <div className="flex-1 min-w-0">
                          {/* Cool Category Badge with Icon */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                              <div className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                                {categories.find(c => c.name === q.category)?.icon.startsWith('http') ? (
                                  <img 
                                    src={categories.find(c => c.name === q.category)?.icon} 
                                    alt={q.category}
                                    className="w-4 h-4"
                                  />
                                ) : (
                                  <span className="text-sm">
                                    {categories.find(c => c.name === q.category)?.icon || '💻'}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                                  {q.category}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Question Title with Neon Effect */}
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-500 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                            {q.question}
                          </h3>
                          
                          {/* Tagline with cool styling */}
                          {q.tagline && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="text-blue-400 font-bold">#</span>
                              <span className="text-gray-400">{q.tagline}</span>
                              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons with Enhanced Styling */}
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleViewAnswer(q)}
                            className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all text-sm font-medium group/btn overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                            <Eye size={16} className="relative group-hover/btn:scale-110 transition-transform" />
                            <span className="relative">View</span>
                            <div className="absolute inset-0 rounded-lg shadow-lg shadow-emerald-500/0 group-hover/btn:shadow-emerald-500/30 transition-shadow"></div>
                          </button>
                          
                          <button
                            onClick={() => handlePostAnswer(q)}
                            className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-sm font-medium group/btn overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                            <Edit3 size={16} className="relative group-hover/btn:scale-110 transition-transform" />
                            <span className="relative">Answer</span>
                            <div className="absolute inset-0 rounded-lg shadow-lg shadow-blue-500/0 group-hover/btn:shadow-blue-500/40 transition-shadow"></div>
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

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Problems;


// import React, { useEffect, useState } from 'react';
// import { Search, Eye, Edit3, Code2, Sparkles } from 'lucide-react';

// // Mock Nav component since it's imported
// const Nav = () => (
//   <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//     <div className="flex items-center justify-between">
//       <h1 className="text-xl font-bold text-white">CodeBuddy</h1>
//       <div className="flex gap-4">
//         <button className="text-gray-400 hover:text-white transition-colors">Home</button>
//         <button className="text-gray-400 hover:text-white transition-colors">Profile</button>
//       </div>
//     </div>
//   </div>
// );

// const Problems = () => {
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [searchText, setSearchText] = useState('');
//   const [questions, setQuestions] = useState([
//     { category: 'Python', question: 'How to reverse a string in Python?', tagline: 'string-manipulation' },
//     { category: 'Java', question: 'What is the difference between ArrayList and LinkedList?', tagline: 'data-structures' },
//     { category: 'DSA', question: 'Implement binary search algorithm', tagline: 'algorithms' },
//     { category: 'JavaScript', question: 'Explain closures in JavaScript', tagline: 'fundamentals' },
//     { category: 'SQL', question: 'Write a query to find duplicate records', tagline: 'queries' },
//   ]);

//   const categories = [
//     { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
//     { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
//     { name: 'DSA', icon: '🧠' },
//     { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
//     { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
//     { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
//     { name: 'Others', icon: '✨' }
//   ];

//   const filteredQuestions = questions.filter((q) => {
//     const matchesCategory = selectedCategory ? q.category === selectedCategory : true;
//     const matchesSearch = (q.question?.toLowerCase() || "").includes(
//       (searchText || "").toLowerCase()
//     );
//     return matchesCategory && matchesSearch;
//   });

//   const handlePostAnswer = (question) => {
//     console.log('Post answer for:', question);
//   };

//   const handleViewAnswer = (question) => {
//     console.log('View answer for:', question);
//   };

//   return (
//     <div className="min-h-screen bg-[#0A0E12] text-gray-100 relative overflow-hidden">
//       {/* Fixed Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//         {/* Gradient Orbs with enhanced animations */}
//         <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-orb-1"></div>
//         <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-orb-2"></div>
//         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-orb-3"></div>
        
//         {/* Animated Grid Pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-flow"></div>
        
//         {/* Floating Particles */}
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-particle-1"></div>
//         <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-particle-2"></div>
//         <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-400/30 rounded-full animate-particle-3"></div>
//         <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-particle-4"></div>
        
//         {/* Floating Code Elements with enhanced animation */}
//         <div className="absolute top-32 right-20 text-blue-500/10 font-mono text-sm animate-float-complex">
//           {'const solve = () => {}'}
//         </div>
//         <div className="absolute bottom-40 left-20 text-purple-500/10 font-mono text-sm animate-float-complex" style={{ animationDelay: '1.5s' }}>
//           {'if (problem) { answer(); }'}
//         </div>
//         <div className="absolute top-2/3 right-1/3 text-emerald-500/10 font-mono text-sm animate-float-complex" style={{ animationDelay: '2.5s' }}>
//           {'[...questions].filter()'}
//         </div>

//         {/* Scanning Lines */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-scan-line"></div>
//           <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-scan-line-reverse" style={{ animationDelay: '2s' }}></div>
//         </div>
//       </div>

//       <div className="relative z-10">
//         <div className="sticky top-0 z-40 bg-[#0F1115]/80 backdrop-blur-md border-b border-white/10 animate-slide-down">
//           <Nav />
//         </div>

//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
//           {/* Hero Section with staggered animations */}
//           <div className="text-center mb-8 sm:mb-12">
//             <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
//               <Code2 className="text-blue-400 animate-spin-slow" size={16} />
//               <span className="text-xs sm:text-sm text-blue-400 font-medium">Community Q&A</span>
//               <Sparkles className="text-blue-400 animate-pulse" size={12} />
//             </div>
//             <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               Explore <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Questions</span>
//             </h1>
//             <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
//               Browse coding questions, share solutions, and learn together
//             </p>
//           </div>

//           {/* Search Bar with enhanced glow */}
//           <div className="mb-8 sm:mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
//             <div className="relative max-w-3xl mx-auto group">
//               {/* Enhanced Glow effect */}
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse-glow"></div>
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors duration-300 group-hover:animate-bounce-subtle" size={20} />
//                 <input
//                   type="text"
//                   value={searchText}
//                   onChange={(e) => setSearchText(e.target.value)}
//                   placeholder="Search questions by keyword..."
//                   className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#13171D] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 transition-all text-sm hover:border-blue-500/30 focus:scale-[1.01] duration-300"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-6">
//             {/* Left Sidebar - Categories with staggered entry */}
//             <aside className="w-full lg:w-72 shrink-0 animate-slide-in-left">
//               <div className="bg-[#13171D] rounded-xl border border-white/10 p-4 sm:p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto hover:border-blue-500/30 transition-all duration-300">
//                 <h2 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 animate-pulse-text">
//                   Filter by Category
//                 </h2>
//                 <div className="space-y-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
//                   {categories.map((cat, idx) => (
//                     <button
//                       key={cat.name}
//                       onClick={() => setSelectedCategory(cat.name)}
//                       className={`w-full flex flex-col sm:flex-row lg:flex-row items-center lg:items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-500 group/btn animate-fade-in-up hover:scale-105 hover:-translate-y-1 relative ${
//                         selectedCategory === cat.name
//                           ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 text-white shadow-lg shadow-blue-500/20 scale-105'
//                           : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
//                       }`}
//                       style={{ animationDelay: `${idx * 0.05}s` }}
//                     >
//                       {cat.icon.startsWith('http') ? (
//                         <img src={cat.icon} alt={cat.name} className="w-6 sm:w-8 h-6 sm:h-8 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" />
//                       ) : (
//                         <span className="text-lg sm:text-2xl group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">{cat.icon}</span>
//                       )}
//                       <span className="text-xs sm:text-sm font-semibold text-center">{cat.name}</span>
//                       {selectedCategory === cat.name && (
//                         <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
                
//                 {selectedCategory && (
//                   <button
//                     onClick={() => setSelectedCategory('')}
//                     className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 animate-fade-in relative overflow-hidden group"
//                   >
//                     <span className="relative z-10">Clear Filter</span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
//                   </button>
//                 )}
//               </div>
//             </aside>

//             {/* Main Content - Questions List */}
//             <main className="w-full lg:flex-1 min-w-0 animate-slide-in-right">
//               <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in-up">
//                 <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
//                   {selectedCategory ? (
//                     <>
//                       <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
//                         {selectedCategory}
//                       </span>
//                       <span className="animate-fade-in">Questions</span>
//                     </>
//                   ) : (
//                     <span className="animate-fade-in">All Questions</span>
//                   )}
//                 </h1>
//                 <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 rounded-lg text-xs sm:text-sm font-medium border border-blue-500/30 shadow-lg shadow-blue-500/10 animate-bounce-in">
//                   {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Question' : 'Questions'}
//                 </span>
//               </div>

//               {filteredQuestions.length === 0 ? (
//                 <div className="bg-[#13171D]/80 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center relative overflow-hidden animate-fade-in">
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse-slow"></div>
//                   <Code2 className="mx-auto text-gray-600 mb-4 relative animate-float" size={48} />
//                   <p className="text-gray-400 text-lg mb-2 relative animate-fade-in-up">No questions found</p>
//                   <p className="text-gray-600 text-sm relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
//                     {searchText ? 'Try a different search term' : 'Be the first to ask a question!'}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredQuestions.map((q, idx) => (
//                     <div
//                       key={idx}
//                       className="bg-[#13171D]/80 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden animate-fade-in-up hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
//                       style={{ animationDelay: `${idx * 0.05}s` }}
//                     >
//                       {/* Animated glow border on hover */}
//                       <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                         <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-xl animate-pulse-glow"></div>
//                       </div>
                      
//                       {/* Hover sweep effect */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                      
//                       {/* Corner accent */}
//                       <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-corner-glow"></div>
                      
//                       <div className="flex items-start justify-between gap-4 relative">
//                         <div className="flex-1 min-w-0">
//                           {/* Cool Category Badge with Icon */}
//                           <div className="flex items-center gap-3 mb-4 animate-slide-in-left" style={{ animationDelay: `${idx * 0.05 + 0.1}s` }}>
//                             <div className="relative group/badge">
//                               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 group-hover/badge:opacity-100 transition-opacity duration-300 animate-pulse-glow"></div>
//                               <div className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg group-hover/badge:scale-110 transition-transform duration-300">
//                                 {categories.find(c => c.name === q.category)?.icon.startsWith('http') ? (
//                                   <img 
//                                     src={categories.find(c => c.name === q.category)?.icon} 
//                                     alt={q.category}
//                                     className="w-4 h-4 group-hover/badge:rotate-12 transition-transform duration-300"
//                                   />
//                                 ) : (
//                                   <span className="text-sm group-hover/badge:rotate-12 transition-transform duration-300">
//                                     {categories.find(c => c.name === q.category)?.icon || '💻'}
//                                   </span>
//                                 )}
//                                 <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
//                                   {q.category}
//                                 </span>
//                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Question Title with Neon Effect */}
//                           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-500 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-500 animate-fade-in cursor-pointer">
//                             {q.question}
//                           </h3>
                          
//                           {/* Tagline with cool styling */}
//                           {q.tagline && (
//                             <div className="flex items-center gap-2 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: `${idx * 0.05 + 0.2}s` }}>
//                               <span className="text-blue-400 font-bold animate-pulse-text">#</span>
//                               <span className="text-gray-400">{q.tagline}</span>
//                               <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent animate-expand"></div>
//                             </div>
//                           )}
//                         </div>

//                         {/* Action Buttons with Enhanced Styling */}
//                         <div className="flex gap-2 shrink-0 animate-slide-in-right" style={{ animationDelay: `${idx * 0.05 + 0.15}s` }}>
//                           <button
//                             onClick={() => handleViewAnswer(q)}
//                             className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all duration-300 text-sm font-medium group/btn overflow-hidden hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30"
//                           >
//                             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
//                             <Eye size={16} className="relative group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" />
//                             <span className="relative">View</span>
//                             <div className="absolute inset-0 rounded-lg shadow-lg shadow-emerald-500/0 group-hover/btn:shadow-emerald-500/30 transition-shadow duration-300"></div>
//                           </button>
                          
//                           <button
//                             onClick={() => handlePostAnswer(q)}
//                             className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 text-sm font-medium group/btn overflow-hidden hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40"
//                           >
//                             <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
//                             <Edit3 size={16} className="relative group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" />
//                             <span className="relative">Answer</span>
//                             <div className="absolute inset-0 rounded-lg shadow-lg shadow-blue-500/0 group-hover/btn:shadow-blue-500/40 transition-shadow duration-300"></div>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </main>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Animation Styles */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(2deg); }
//         }
        
//         @keyframes float-complex {
//           0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.1; }
//           25% { transform: translateY(-15px) translateX(10px) rotate(5deg); opacity: 0.15; }
//           50% { transform: translateY(-30px) translateX(-5px) rotate(-3deg); opacity: 0.1; }
//           75% { transform: translateY(-15px) translateX(-10px) rotate(4deg); opacity: 0.12; }
//         }
        
//         @keyframes orb-1 {
//           0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
//           33% { transform: translate(50px, -30px) scale(1.1); opacity: 0.25; }
//           66% { transform: translate(-30px, 40px) scale(0.95); opacity: 0.15; }
//         }
        
//         @keyframes orb-2 {
//           0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
//           33% { transform: translate(-40px, 50px) scale(1.15); opacity: 0.25; }
//           66% { transform: translate(60px, -20px) scale(0.9); opacity: 0.18; }
//         }
        
//         @keyframes orb-3 {
//           0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.1; }
//           50% { transform: translate(30px, 30px) scale(1.2) rotate(180deg); opacity: 0.15; }
//         }
        
//         @keyframes particle-1 {
//           0%, 100% { transform: translate(0, 0); opacity: 0; }
//           50% { transform: translate(100px, -200px); opacity: 0.3; }
//         }
        
//         @keyframes particle-2 {
//           0%, 100% { transform: translate(0, 0); opacity: 0; }
//           50% { transform: translate(-150px, 100px); opacity: 0.3; }
//         }
        
//         @keyframes particle-3 {
//           0%, 100% { transform: translate(0, 0); opacity: 0; }
//           50% { transform: translate(120px, 150px); opacity: 0.3; }
//         }
        
//         @keyframes particle-4 {
//           0%, 100% { transform: translate(0, 0); opacity: 0; }
//           50% { transform: translate(-80px, -120px); opacity: 0.3; }
//         }
        
//         @keyframes grid-flow {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(50px); }
//         }
        
//         @keyframes scan-line {
//           0% { top: -2px; opacity: 0; }
//           50% { opacity: 1; }
//           100% { top: 100%; opacity: 0; }
//         }
        
//         @keyframes scan-line-reverse {
//           0% { bottom: -2px; opacity: 0; }
//           50% { opacity: 1; }
//           100% { bottom: 100%; opacity: 0; }
//         }
        
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slide-in-left {
//           from {
//             opacity: 0;
//             transform: translateX(-50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes slide-in-right {
//           from {
//             opacity: 0;
//             transform: translateX(50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes bounce-in {
//           0% {
//             opacity: 0;
//             transform: scale(0.3);
//           }
//           50% {
//             opacity: 1;
//             transform: scale(1.05);
//           }
//           70% { transform: scale(0.9); }
//           100% { transform: scale(1); }
//         }
        
//         @keyframes bounce-subtle {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
        
//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
        
//         @keyframes pulse-glow {
//           0%, 100% { opacity: 0.5; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.05); }
//         }
        
//         @keyframes pulse-text {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.8; }
//           50% { opacity: 1; }
//         }
        
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }
        
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
        
//         @keyframes expand {
//           from {
//             width: 0;
//             opacity: 0;
//           }
//           to {
//             width: 100%;
//             opacity: 1;
//           }
//         }
        
//         @keyframes corner-glow {
//           0%, 100% { transform: scale(1) rotate(0deg); opacity: 0; }
//           50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
//         }
        
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-complex { animation: float-complex 8s ease-in-out infinite; }
//         .animate-orb-1 { animation: orb-1 20s ease-in-out infinite; }
//         .animate-orb-2 { animation: orb-2 25s ease-in-out infinite; }
//         .animate-orb-3 { animation: orb-3 30s ease-in-out infinite; }
//         .animate-particle-1 { animation: particle-1 10s ease-in-out infinite; }
//         .animate-particle-2 { animation: particle-2 12s ease-in-out infinite; }
//         .animate-particle-3 { animation particle-3 15s ease-in-out infinite; }
//         .animate-particle-4 { animation: particle-4 11s ease-in-out infinite; }
//         .animate-grid-flow { animation: grid-flow 20s linear infinite; }
//         .animate-scan-line { animation: scan-line 8s linear infinite; }
//         .animate-scan-line-reverse { animation: scan-line-reverse 8s linear infinite; }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
//         .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
//         .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; opacity: 0; }
//         .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; opacity: 0; }
//         .animate-slide-down { animation: slide-down 0.6s ease-out forwards; opacity: 0; }
//         .animate-bounce-in { animation: bounce-in 0.8s ease-out forwards; opacity: 0; }
//         .animate-bounce-subtle { animation: bounce-subtle 1s ease-in-out infinite; }
//         .animate-gradient-shift { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; }
//         .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
//         .animate-pulse-text { animation: pulse-text 3s ease-in-out infinite; }
//         .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
//         .animate-shimmer { animation: shimmer 2s linear infinite; background-size: 2000px 100%; }
//         .animate-spin-slow { animation: spin-slow 8s linear infinite; }
//         .animate-expand { animation: expand 0.6s ease-out forwards; }
//         .animate-corner-glow { animation: corner-glow 2s ease-in-out infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default Problems;