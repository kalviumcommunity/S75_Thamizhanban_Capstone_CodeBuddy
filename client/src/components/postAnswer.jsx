import React, { useState } from 'react';
import Nav from './nav';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, FileText, ArrowLeft } from 'lucide-react';

const PostAnswer = () => {
  const [Answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const question = location.state?.question;
  const token = localStorage.getItem('token');

  const postAnswer = async (e) => {
    e.preventDefault();
    
    if (!Answer.trim()) {
      alert('Please write an answer before submitting!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://codebuddy-4-78bo.onrender.com/api/postAnswer`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
    <div className="min-h-screen bg-[#0A0E12] text-gray-100">
      <Nav />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Problems</span>
        </button>

        {/* Main Card */}
        <div className="bg-[#13171D] rounded-xl border border-white/10 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-blue-500" size={28} />
            <h1 className="text-3xl font-bold text-white">Share Your Solution</h1>
          </div>

          {/* Question Display */}
          <div className="bg-[#0A0E12] rounded-lg border border-white/10 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question</span>
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
              <p className="text-sm text-gray-500 mt-2">#{question.tagline}</p>
            )}
          </div>

          {/* Answer Form */}
          <form onSubmit={postAnswer}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Your Answer
              </label>
              <textarea
                placeholder="Provide a detailed solution... Include code examples, explanations, and any helpful resources."
                className="w-full h-80 px-4 py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-600 resize-none font-mono text-sm"
                value={Answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">
                  Tip: Use clear formatting and include code examples where applicable
                </p>
                <span className="text-xs text-gray-600">
                  {Answer.length} characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !Answer.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors font-medium"
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
        <div className="mt-8 bg-[#13171D] rounded-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Tips for a Great Answer
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Break down complex solutions into clear, digestible steps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Include code snippets with proper formatting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Explain the logic and reasoning behind your approach</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Consider edge cases and alternative solutions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostAnswer;