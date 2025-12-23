import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import Flashcard from './components/Flashcard';
import Statistics from './components/Statistics';
import ThemeToggle from './components/ThemeToggle';
import ShareQuiz from './components/ShareQuiz';
import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import UserSelector from './components/UserSelector';
import OnboardingModal from './components/OnboardingModal';
import { useAuth } from './contexts/AuthContext';
import { generateQuiz } from './utils/quizGenerator';
import { generateFlashcards } from './utils/flashcardGenerator';
import { saveQuizData, saveFlashcardData, saveQuizResults, getQuizResults, getCurrentUser, setCurrentUser as storageSetCurrentUser, getUserProfile, saveUserProfile, getUsers, saveUsers } from './utils/storage';

function App() {
  const [documentText, setDocumentText] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // upload, quiz, flashcards, stats
  const [quizResults, setQuizResults] = useState([]);
  const [showShareQuiz, setShowShareQuiz] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const authContext = useAuth();

  useEffect(() => {
    // Load previous quiz results for the active user
    const savedResults = getQuizResults(currentUser);
    setQuizResults(savedResults);
  }, [currentUser]);

  useEffect(() => {
    // If current user doesn't have a profile saved, show onboarding
    const profile = getUserProfile(currentUser);
    if (!profile || currentUser === 'default') {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [currentUser]);

  // When Firebase auth user changes, sync it to app state and storage.
  useEffect(() => {
    const aUser = authContext && authContext.currentUser ? authContext.currentUser : null;
    if (aUser) {
      const uid = aUser.uid;
      const existing = getUserProfile(uid);
      if (!existing) {
        saveUserProfile(uid, { name: aUser.displayName || 'User', email: aUser.email || '' });
      }
      setCurrentUser(uid);
      storageSetCurrentUser(uid);
      setShowOnboarding(false);
    }
  }, [authContext && authContext.currentUser]);
  const handleOnboardingComplete = (payload) => {
    const { name, email, password, providerUid, provider } = payload || {};
    const normalized = (name || '').trim();
    if (!normalized) return;

    // update users list
    const existing = getUsers();
    const updated = Array.from(new Set([normalized, ...existing]));
    saveUsers(updated);

    // Try Firebase signup when available, otherwise fallback to local profile
    (async () => {
      try {
        // If providerUid provided (e.g., Google), skip signup and save profile by uid
        if (providerUid) {
          const uid = providerUid;
          saveUserProfile(uid, { name: normalized, email, uid, provider });
          setCurrentUser(uid);
          storageSetCurrentUser(uid);
          setShowOnboarding(false);
          return;
        }

        if (authContext && authContext.signup && password) {
          const user = await authContext.signup(email, password, normalized);
          const uid = (user && user.uid) ? user.uid : email;
          saveUserProfile(uid, { name: normalized, email, uid });
          setCurrentUser(uid);
          storageSetCurrentUser(uid);
          setShowOnboarding(false);
          return;
        }
      } catch (e) {
        console.error('Firebase signup error', e);
        // fall back to local profile if signup fails
      }

      saveUserProfile(normalized, { name: normalized, email });
      setCurrentUser(normalized);
      storageSetCurrentUser(normalized);
      setShowOnboarding(false);
    })();
  };

  const handleOnboardingCancel = () => {
    // keep modal open until user provides details; as a fallback close and keep default
    setShowOnboarding(false);
  };

  const handleHeaderGoogleSignIn = async () => {
    try {
      if (!authContext || !authContext.signInWithGoogle) {
        alert('Firebase authentication is not configured. Please set up Firebase environment variables in your .env file to use Google sign-in.');
        return;
      }
      
      const user = await authContext.signInWithGoogle();
      if (user && user.uid) {
        const profile = getUserProfile(user.uid);
        if (!profile) {
          saveUserProfile(user.uid, {
            name: user.displayName || 'User',
            email: user.email || '',
            uid: user.uid,
            provider: 'google'
          });
        }
        setCurrentUser(user.uid);
        storageSetCurrentUser(user.uid);
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.message && error.message.includes('Firebase not configured')) {
        alert('Firebase is not configured. Please check your environment variables and ensure Firebase is properly set up.');
      } else {
        alert(`Google sign-in failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  

  const handleFileProcessed = async ({ file, text, fileName }) => {
    setIsProcessing(true);
    setDocumentText(text);
    setActiveTab('upload');

    try {
      // Generate quiz questions
      const questions = generateQuiz(text, 10);
      setQuizQuestions(questions);
      saveQuizData({ questions, fileName, text: text.substring(0, 500) }, currentUser);

      // Generate flashcards
      const cards = generateFlashcards(text, 20);
      setFlashcards(cards);
      saveFlashcardData({ flashcards: cards, fileName }, currentUser);

      setIsProcessing(false);
      // Automatically switch to quiz tab
      setActiveTab('quiz');
    } catch (error) {
      console.error('Error generating content:', error);
      setIsProcessing(false);
      alert('Error generating quiz and flashcards. Please try again.');
    }
  };

  const handleQuizComplete = (results, timeElapsed) => {
    const completeResults = {
      ...results,
      timeElapsed,
      timestamp: new Date().toISOString()
    };
    
    const updatedResults = [...quizResults, completeResults];
    setQuizResults(updatedResults);
    saveQuizResults(completeResults, currentUser);
    setActiveTab('stats');
    setShowShareQuiz(true);
  };

  const handleFlashcardComplete = (results) => {
    // Could save flashcard progress here if needed
  };

  const handleReset = () => {
    setDocumentText(null);
    setQuizQuestions([]);
    setFlashcards([]);
    setActiveTab('upload');
    setShowShareQuiz(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        quizQuestions={quizQuestions}
        flashcards={flashcards}
        onReset={handleReset}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
      />

      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} onCancel={handleOnboardingCancel} />

      {/* Main Content Area */}
      <div className={`${sidebarOpen ? 'md:ml-64' : 'md:ml-0'} min-h-screen transition-all duration-300`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 md:px-8 py-3 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white truncate">
                  {activeTab === 'upload' && 'Document Upload'}
                  {activeTab === 'quiz' && 'Quiz Session'}
                  {activeTab === 'flashcards' && 'Flashcards'}
                  {activeTab === 'stats' && 'Statistics & Insights'}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {activeTab === 'upload' && 'Upload your study materials to get started'}
                  {activeTab === 'quiz' && 'Test your knowledge with interactive questions'}
                  {activeTab === 'flashcards' && 'Review key concepts with flashcards'}
                  {activeTab === 'stats' && 'Track your progress and performance'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-3">
                <UserSelector currentUser={currentUser} onChange={(u) => { setCurrentUser(u); storageSetCurrentUser(u); }} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 md:px-8 py-6 md:py-8">
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <FileUpload onFileProcessed={handleFileProcessed} isProcessing={isProcessing} />
            
            {documentText && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Document Processed Successfully!
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Ready to start studying
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Quiz Questions</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-1">{quizQuestions.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-100 dark:border-rose-900/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Flashcards</p>
                        <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1">{flashcards.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View Flashcards
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-4xl mx-auto">
            {showShareQuiz && quizQuestions.length > 0 && (
              <div className="mb-6">
                <ShareQuiz quizData={{ questions: quizQuestions }} />
              </div>
            )}
            <Quiz questions={quizQuestions} onQuizComplete={handleQuizComplete} />
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="max-w-4xl mx-auto">
            <Flashcard flashcards={flashcards} onComplete={handleFlashcardComplete} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-4xl mx-auto">
            <Statistics results={quizResults} />
          </div>
        )}
        </main>

        {/* Footer with Z Logo - Narrow */}
        <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 gap-3">
              <div className="text-center md:text-left flex-1">
                <p className="text-gray-600 dark:text-gray-400 font-medium text-xs">
                  FlashQuiz+ - Generate quizzes and flashcards from your study documents
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                  Built with React.js and Tailwind CSS
                </p>
              </div>
              <div className="max-md:hidden">
                <Logo />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
