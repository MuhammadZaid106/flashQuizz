import React from 'react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Z Logo */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-white text-xl font-bold">Z</span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 rounded-xl blur-md opacity-50 -z-10"></div>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
        FlashQuiz+
      </p>
    </div>
  );
};

export default Logo;
