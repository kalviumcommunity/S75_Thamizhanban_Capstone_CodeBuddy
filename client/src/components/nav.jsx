import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, Home, FileQuestion, User, Menu, X } from 'lucide-react';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/problems', label: 'Problems', icon: FileQuestion },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#13171D]/95 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate('/home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Code2 className="text-blue-500 group-hover:text-blue-400 transition-colors" size={28} />
          <span className="text-xl font-semibold text-white">
            Code<span className="text-blue-500">Buddy</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="text-white" size={24} />
          ) : (
            <Menu className="text-white" size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#13171D] border-b border-white/10 shadow-2xl">
          <ul className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;