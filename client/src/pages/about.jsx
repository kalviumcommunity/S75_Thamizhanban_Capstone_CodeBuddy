import React from 'react';
import {
  Code2,
  Users2,
  Target,
  Layers,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Globe
} from 'lucide-react';
// Nav handled by Layout

const About = () => {
  const features = [
    { title: 'Categorized Problems', desc: 'Browse Data Structures, Algorithms, and Full-Stack challenges.', icon: <Layers className="text-blue-400" /> },
    { title: 'Real-time Collaboration', desc: 'Solve doubts and collaborate with peers instantly.', icon: <Users2 className="text-purple-400" /> },
    { title: 'AI Assistance', desc: 'Get instant debugging help and code explanations.', icon: <Sparkles className="text-yellow-400" /> },
    { title: 'Community Driven', desc: 'Participate in Q&A forums and concept discussions.', icon: <MessageSquare className="text-green-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E12] text-gray-100 font-sans relative overflow-hidden">

      {/* --- SHARED BACKGROUND ANIMATION LAYER --- */}
      {/* Background handled by Layout */}

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10">


        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left Sidebar - Quick Links (Mirroring Homepage Sidebar) */}
            <aside className="w-full lg:w-72 shrink-0 hidden lg:block">
              <div className="bg-[#13171D]/80 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6 sticky top-24">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">On This Page</h2>
                <nav className="space-y-2">
                  {['The Vision', 'Key Features', 'Our Tech Stack', 'Target Audience'].map((item) => (
                    <button key={item} className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all text-xs sm:text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="w-full lg:flex-1">
              {/* Hero Section */}
              <section className="mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4 sm:mb-6">
                  <Code2 size={14} />
                  <span>About CodeBuddy</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-gray-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                  Empowering Developers to <br /> Learn and Collaborate.
                </h1>
                <p className="text-base sm:text-xl text-gray-400 leading-relaxed max-w-3xl">
                  CodeBuddy is a developer-oriented platform designed to help programmers learn, practice, and collaborate on coding problems in a clean, intuitive environment.
                </p>
              </section>

              {/* Features Grid */}
              <section className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
                {features.map((feature, idx) => (
                  <div key={idx} className="p-4 sm:p-6 bg-[#13171D]/60 backdrop-blur-lg border border-white/10 rounded-xl hover:border-blue-500/30 transition-all group">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-[#0A0E12] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </section>

              {/* Tech Stack Section (Optional but recommended for About pages) */}
              <section className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-12 sm:mb-16">
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <Globe className="text-purple-400" size={20} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Project Tech Stack</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Frontend', val: 'React / Tailwind' },
                    { label: 'Backend', val: 'Node.js / Python' },
                    { label: 'Database', val: 'MySQL / MongoDB' },
                    { label: 'Real-time', val: 'Socket.io / AI' }
                  ].map((tech, i) => (
                    <div key={i} className="text-center p-3 sm:p-4 bg-[#0A0E12]/40 rounded-lg border border-white/5">
                      <p className="text-xs text-gray-500 uppercase mb-1">{tech.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-200">{tech.val}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mission/Audience Section */}
              <section className="bg-[#13171D]/40 border border-white/10 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                  <Target size={100} />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    Who It's For
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      'Students learning software engineering fundamentals.',
                      'Devs preparing for technical interviews.',
                      'Coding bootcamp participants seeking practice.',
                      'Anyone wanting a friendly platform to improve skills.',
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle2 className="text-blue-500 mt-0.5 sm:mt-1 shrink-0" size={16} />
                        <p className="text-gray-300 text-sm sm:text-base">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      {/* Floating Animation Styles & Custom Scrollbar (Matched to Homepage) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default About;