import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, ArrowRight, Sparkles, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { success, message: msg } = await login(email, password);

      if (success) {
        setMessage('Login Successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
        setEmail('');
        setPass('');
      } else {
        setMessage(msg || 'Login Failed. Please check your credentials.');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E12] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Floating Code Snippets */}
        <div className="absolute top-20 left-10 text-blue-500/10 font-mono text-sm animate-float">
          {'{ code: "buddy" }'}
        </div>
        <div className="absolute top-40 right-20 text-purple-500/10 font-mono text-sm animate-float" style={{ animationDelay: '2s' }}>
          {'</>'}
        </div>
        <div className="absolute bottom-32 left-1/3 text-blue-500/10 font-mono text-sm animate-float" style={{ animationDelay: '1s' }}>
          {'function() {}'}
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>

        {/* Card Content */}
        <div className="relative bg-[#13171D] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Logo & Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-3 sm:mb-4">
              <Code2 className="text-white" size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Sign in to continue your coding journey
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
                  className="w-full pl-12 pr-4 py-2 sm:py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-600 transition-all text-sm"
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
                  className="w-full pl-12 pr-4 py-2 sm:py-3 bg-[#0A0E12] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-600 transition-all text-sm"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-xs sm:text-sm text-center ${message.includes('Successful')
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
                <span className="px-4 bg-[#13171D] text-gray-500">or continue with</span>
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

            {/* Sign Up Link */}
            <p className="text-center text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                Sign up
                <Sparkles size={14} />
              </button>
            </p>
          </form>
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

export default Login;