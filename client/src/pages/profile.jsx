import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Nav handled by Layout
import { User, MessageSquare, CheckCircle, Star, Award, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    avgRating: 0,
    bestRating: 0
  });

  const email = user?.email;
  const username = email ? email.split('@')[0] : 'User';

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [qRes, aRes] = await Promise.all([
          fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/myQuestions`, {
            credentials: 'include'
          }),
          fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/myAnswers`, {
            credentials: 'include'
          })
        ]);

        const qData = await qRes.json();
        const aData = await aRes.json();

        const safeQData = Array.isArray(qData) ? qData : [];
        const safeAData = Array.isArray(aData) ? aData : [];

        setQuestions(safeQData);
        setAnswers(safeAData);

        // Calculate stats
        const totalAnswers = safeAData.length;
        const ratings = safeAData.map(a => a.rating || 0).filter(r => r > 0);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
        const bestRating = ratings.length > 0 ? Math.max(...ratings) : 0;

        setStats({
          totalQuestions: safeQData.length,
          totalAnswers,
          avgRating: avgRating.toFixed(1),
          bestRating: bestRating.toFixed(1)
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0A0E12] text-gray-100">
      <div className="max-w-6xl mx-auto pt-8 pb-12">
        {/* Profile Header */}
        <div className="bg-[#13171D] rounded-xl border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {username}!
              </h1>
              <p className="text-gray-400">{email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="text-blue-500" size={24} />
              <span className="text-gray-400 text-sm">Questions</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
          </div>

          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-emerald-500" size={24} />
              <span className="text-gray-400 text-sm">Answers</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalAnswers}</p>
          </div>

          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-yellow-500" size={24} />
              <span className="text-gray-400 text-sm">Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.avgRating}
              <span className="text-lg text-gray-500">/5</span>
            </p>
          </div>

          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-purple-500" size={24} />
              <span className="text-gray-400 text-sm">Best Rating</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.bestRating}
              <span className="text-lg text-gray-500">/5</span>
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Posted Questions */}
          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-white">Your Questions</h2>
              <span className="ml-auto px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30">
                {questions.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto text-gray-600 mb-3" size={48} />
                  <p className="text-gray-500 text-sm">No questions posted yet</p>
                  <p className="text-gray-600 text-xs mt-1">Ask your first question!</p>
                </div>
              ) : (
                questions.map((q) => (
                  <div key={q._id} className="bg-[#0A0E12] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      {q.category && (
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs font-medium">
                          {q.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200 font-medium line-clamp-2">
                      {q.question}
                    </p>
                    {q.tagline && (
                      <p className="text-xs text-gray-600 mt-1">#{q.tagline}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Posted Answers */}
          <div className="bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-emerald-500" size={24} />
              <h2 className="text-xl font-bold text-white">Your Answers</h2>
              <span className="ml-auto px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded text-xs font-medium border border-emerald-500/30">
                {answers.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {answers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-gray-600 mb-3" size={48} />
                  <p className="text-gray-500 text-sm">No answers posted yet</p>
                  <p className="text-gray-600 text-xs mt-1">Help someone by answering!</p>
                </div>
              ) : (
                answers.map((a) => (
                  <div key={a._id} className="bg-[#0A0E12] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
                    {a.question?.question && (
                      <p className="text-sm text-gray-200 font-medium mb-2 line-clamp-2">
                        {a.question.question}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {a.question?.category && (
                          <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs font-medium">
                            {a.question.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          className={`${a.rating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                          size={14}
                        />
                        <span className="text-xs text-gray-500">
                          {a.rating?.toFixed(1) || '0.0'}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        {(questions.length > 0 || answers.length > 0) && (
          <div className="mt-8 bg-[#13171D] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Your Impact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Contribution Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {((stats.totalAnswers / (stats.totalQuestions + stats.totalAnswers || 1)) * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-gray-500">answers given</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Top Category</p>
                <span className="text-2xl font-bold text-white">
                  {questions[0]?.category || answers[0]?.question?.category || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Quality Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {stats.avgRating > 0 ? ((stats.avgRating / 5) * 100).toFixed(0) : 0}%
                  </span>
                  <span className="text-sm text-gray-500">based on ratings</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;