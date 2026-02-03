import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, ArrowRight, User, Sparkles, Github, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { success, message: msg } = await signup(email, password);

      if (success) {
        setMessage('Account Created! Redirecting to Login...');
        setTimeout(() => navigate('/login'), 1500);
        setEmail('');
        setPass('');
      } else {
        setMessage(msg || 'Signup Failed. Please try again.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Code2 size={16} />, text: 'Get instant AI coding help' },
    { icon: <Sparkles size={16} />, text: 'Join a community of learners' },
    { icon: <CheckCircle size={16} />, text: 'Track your progress' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E12] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-10 text-purple-500/10 font-mono text-sm animate-float">
          {'const learn = () => {}'}
        </div>
        <div className="absolute bottom-20 right-1/3 text-blue-500/10 font-mono text-sm animate-float" style={{ animationDelay: '1s' }}>
          {'while(coding) { improve(); }'}
        </div>
        <div className="absolute top-1/2 left-10 text-purple-500/10 font-mono text-sm animate-float" style={{ animationDelay: '2s' }}>
          {'[1, 2, 3].map()'}
        </div>
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch">
        {/* Left Side - Marketing Content (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col gap-6 w-full lg:w-auto">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="text-blue-400" size={16} />
              <span className="text-sm text-blue-400 font-medium">Join 10,000+ developers</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Coding Journey
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-8">
              Master programming with AI assistance, community support, and personalized learning paths.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4 hover:border-blue-500/30 transition-all"
              >
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400">
                  {feature.icon}
                </div>
                <span className="text-gray-300 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-gray-500">Questions Solved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-sm text-gray-500">User Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 max-w-md w-full relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>

          {/* Card Content */}
          <div className="relative bg-[#13171D] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Logo & Title */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-3 sm:mb-4">
                <Code2 className="text-white" size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Get started with CodeBuddy for free
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-2 sm:py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-600 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-2 sm:py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-600 transition-all text-sm"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">Must be at least 6 characters</p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 bg-[#0A0E12] border border-white/10 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label className="text-xs sm:text-sm text-gray-400">
                  I agree to the{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-xs sm:text-sm text-center ${message.includes('Created')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {message}
                </div>
              )}

              {/* Divider */}
              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-4 bg-[#13171D] text-gray-500">or sign up with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <button
                type="button"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Github size={20} />
                <span>GitHub</span>
              </button>

              {/* Sign In Link */}
              <p className="text-center text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
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
      `}</style>
    </div>
  );
};

export default Signup;