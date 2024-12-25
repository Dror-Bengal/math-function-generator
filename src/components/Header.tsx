import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="py-8 px-4 text-center bg-white/40 backdrop-blur-sm shadow-sm">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3 animate-fade-in">
        {title}
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </header>
  );
}; 