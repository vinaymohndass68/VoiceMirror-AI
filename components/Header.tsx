
import React from 'react';

interface Props {
  onHome: () => void;
}

const Header: React.FC<Props> = ({ onHome }) => {
  return (
    <header className="w-full flex justify-between items-center py-6">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onHome}
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          VoiceMirror<span className="text-purple-500 ml-1">AI</span>
        </h1>
      </div>
      
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <span className="hover:text-white transition-colors cursor-pointer">Archive</span>
        <span className="hover:text-white transition-colors cursor-pointer">Engine</span>
        <span className="hover:text-white transition-colors cursor-pointer">Docs</span>
      </div>
    </header>
  );
};

export default Header;
