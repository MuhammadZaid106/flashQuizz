import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../utils/storage';

const Sidebar = ({ activeTab, setActiveTab, quizQuestions, flashcards, onReset, isOpen, onClose, currentUser = 'default', onSignOut }) => {
  const [showHowToUse, setShowHowToUse] = useState(false);
  const auth = useAuth();
  const profile = getUserProfile(currentUser);
  const authName = auth && auth.currentUser && auth.currentUser.displayName ? auth.currentUser.displayName : null;
  const displayName = authName || (profile && profile.name) || (currentUser === 'default' ? 'Default User' : (
    // if currentUser looks like a uid, shorten it for display
    currentUser.length > 12 ? `${currentUser.slice(0,6)}...${currentUser.slice(-4)}` : currentUser
  ));
  const menuItems = [
    {
      id: 'upload',
      label: 'Upload Document',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      disabled: false
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: quizQuestions.length,
      disabled: quizQuestions.length === 0
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: flashcards.length,
      disabled: flashcards.length === 0
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      disabled: false
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        aria-hidden={!isOpen}
        className={
          'fixed left-0 top-0 h-full w-64 max-w-full sm:w-72 md:w-64 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl z-40 transform transition-transform duration-300 flex flex-col ' +
          (isOpen ? 'translate-x-0' : '-translate-x-full')
        }
      >
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 text-white rounded-xl p-3 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
                  FlashQuiz+
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Study Smart
                </p>
              </div>
            </div>
            {/* Close button removed to keep single header toggle (hamburger) */}
          </div>
        </div>

        {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* How to Use Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowHowToUse(!showHowToUse)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20 hover:from-purple-100 hover:to-rose-100 dark:hover:from-purple-900/30 dark:hover:to-rose-900/30 text-purple-700 dark:text-purple-300 rounded-lg transition-all border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">How to Use</span>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${showHowToUse ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showHowToUse && (
            <div className="mt-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Upload your PDF, DOCX, or TXT study document</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Wait for quiz questions and flashcards to generate automatically</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Take quizzes to test your knowledge with instant feedback</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Review flashcards by clicking to flip and study key concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <span>Check statistics to track your progress and identify weak areas</span>
                </li>
              </ol>
            </div>
          )}
        </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 pb-32 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-rose-400'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      </div>

      {/* Bottom Section - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        {/* Reset Button */}
        {(quizQuestions.length > 0 || flashcards.length > 0) && (
          <div className="px-4 pt-4 pb-3">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">Reset Session</span>
            </button>
          </div>
        )}
        
        {/* User / Branding at Bottom */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">{displayName && displayName[0] ? displayName[0].toUpperCase() : 'U'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{auth && auth.currentUser ? 'Signed in' : 'Profile'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Sign Out Button - Mobile */}
              {auth && auth.currentUser && auth.logout && (
                <button
                  onClick={async () => {
                    try {
                      await auth.logout();
                      if (onSignOut) {
                        onSignOut();
                      }
                    } catch (e) {
                      console.error('Sign out error:', e);
                    }
                  }}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              <div className="text-xs text-gray-400">v1.0</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
