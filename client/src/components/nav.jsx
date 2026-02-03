import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, Home, FileQuestion, User, Menu, X, Info, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/problems', label: 'Problems', icon: FileQuestion },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0F1115]/90 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

        {/* --- Logo Section --- */}
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
            <Code2 className="text-blue-500" size={26} />
          </div>
          <span className="text-xl font-bold text-gray-100 tracking-tight">
            Code<span className="text-blue-500">Buddy</span>
          </span>
        </div>

        {/* --- Desktop Navigation (Hidden on Mobile) --- */}
        {/* IMPORTANT: 'hidden' hides it on all screens by default (mobile). 'lg:flex' shows it only on large screens. */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      ${active
                        ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} className={active ? "text-blue-400" : ""} />
                    <span>{item.label}</span>

                    {/* Active Indicator Dot */}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10"></div>

          {/* Logout Button (Desktop) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium group"
          >
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>

        {/* --- Mobile Menu Button (Visible only on Mobile) --- */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {/* Renders outside the flex container but inside nav to overlay properly */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0F1115]/95 backdrop-blur-xl border-b border-t border-white/10 shadow-2xl animate-in slide-in-from-top-5">
          <div className="p-4 space-y-4">
            <ul className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium text-sm transition-all border
                        ${active
                          ? 'bg-blue-600/10 border-blue-500/30 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon size={24} className={active ? "text-blue-400" : "text-gray-500"} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Logout */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-medium"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;