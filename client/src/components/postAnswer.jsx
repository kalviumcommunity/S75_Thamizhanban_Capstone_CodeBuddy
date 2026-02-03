import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Nav from './nav';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, FileText, ArrowLeft, Lightbulb, Sparkles } from 'lucide-react';

const PostAnswer = () => {
  const [Answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const question = location.state?.question;

  const postAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to post an answer!");
      return;
    }

    if (!Answer.trim()) {
      alert('Please write an answer before submitting!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://s75-thamizhanban-capstone-codebuddy.onrender.com/api/postAnswer`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          answer: Answer,
          question: question._id
        })
      });

      if (response.ok) {
        setAnswer('');
        alert("Answer successfully posted!");
        navigate('/problems');
      } else {
        const error = await response.json();
        alert(`Failed to post answer: ${error.message}`);
      }

    } catch (err) {
      console.error("Error:", err.message);
      alert('An error occurred while posting your answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans relative overflow-hidden">

      {/* --- BACKGROUND ANIMATION LAYER (Matched to Home) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-20 text-blue-500/5 font-mono text-sm animate-float">
          {'return solution;'}
        </div>
        <div className="absolute bottom-20 left-20 text-purple-500/5 font-mono text-sm animate-float" style={{ animationDelay: '2s' }}>
          {'export default Answer;'}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10">
        <header className="sticky top-0 z-40 bg-[#0F1115]/80 backdrop-blur-md border-b border-white/10">
          <div className="mx-auto max-w-screen-2xl flex items-center justify-between px-6 py-4">
            <Nav />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">

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

          {/* Main Form Card */}
          <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle glow effect inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <FileText className="text-blue-500" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Share Your Solution
                </h1>
                <p className="text-gray-400 text-sm mt-1">Help the community by posting your approach</p>
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-[#0A0E12]/60 rounded-xl border border-white/10 p-6 mb-8 relative group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Selected Question</span>
                {question?.category && (
                  <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30">
                    {question.category}
                  </span>
                )}
              </div>
              <p className="text-xl font-medium text-gray-200 leading-relaxed">
                {question?.question || 'No question provided'}
              </p>
              {question?.tagline && (
                <div className="flex items-center gap-2 mt-3">
                  <Sparkles size={14} className="text-purple-400" />
                  <p className="text-sm text-purple-400/80 font-medium">{question.tagline}</p>
                </div>
              )}
            </div>

            {/* Answer Form */}
            <form onSubmit={postAnswer} className="relative z-10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Your Solution
                  </label>
                  <span className="text-xs text-gray-500 font-mono">
                    {Answer.length} chars
                  </span>
                </div>

                <textarea
                  placeholder="Provide a detailed solution... Include code examples, explanations, and any helpful resources."
                  className="w-full h-80 px-5 py-4 bg-[#0A0E12]/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 placeholder-gray-600 resize-none font-mono text-sm transition-all hover:bg-[#0A0E12]/70"
                  value={Answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 px-1">
                  <p>Supports Markdown-style formatting</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !Answer.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 rounded-lg text-white font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Post Answer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-[#13171D]/60 backdrop-blur-md rounded-xl border border-white/5 p-6 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-yellow-500" size={20} />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Tips for a Great Answer
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Break down complex solutions into clear, digestible steps.",
                "Include code snippets with proper indentation and comments.",
                "Explain the time and space complexity of your solution.",
                "Mention any edge cases you considered."
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#0A0E12]/30 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span className="text-sm text-gray-400 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PostAnswer;