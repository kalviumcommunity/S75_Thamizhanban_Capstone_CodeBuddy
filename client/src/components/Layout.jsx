import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './nav';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans relative overflow-x-hidden">
            {/* Background elements common to all pages */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10">
                <Nav />
                {/* Add padding top to account for fixed navbar (h-16 = 4rem = 64px) */}
                <div className="pt-20 px-4 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
