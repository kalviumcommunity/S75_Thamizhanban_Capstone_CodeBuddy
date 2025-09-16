import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#A8DADC] flex justify-between items-center px-12 shadow-md z-50 font-sans">
      <div className="flex items-center text-2xl font-bold text-black">
        <span className="text-3xl mr-4 cursor-pointer">☰</span>
        <span>CODE <b>BUDDY</b></span>
      </div>

      <ul className="flex gap-10 list-none">
        <li
          onClick={() => navigate('/home')}
          className="cursor-pointer relative text-lg font-medium text-gray-800 hover:text-pink-500 transition"
        >
          Home
        </li>
        <li
          onClick={() => navigate('/problems')}
          className="cursor-pointer relative text-lg font-medium text-gray-800 hover:text-pink-500 transition"
        >
          Problems
        </li>

        <li
          onClick={() => navigate('/profile')}
          className="cursor-pointer relative text-lg font-medium text-gray-800 hover:text-pink-500 transition"
        >
          Profile
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
