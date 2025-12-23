import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const OnboardingModal = ({ open, onComplete, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const mail = email.trim();
    const pwd = password;
    if (!trimmed || !mail || !pwd) return;
    onComplete({ name: trimmed, email: mail, password: pwd });
  };

  const handleGoogle = async () => {
    if (!auth || !auth.signInWithGoogle) {
      alert('Firebase authentication is not configured. Please set up Firebase environment variables in your .env file to use Google sign-in.');
      return;
    }
    try {
      const user = await auth.signInWithGoogle();
      if (user) {
        onComplete({ name: user.displayName || user.email, email: user.email, providerUid: user.uid, provider: 'google' });
      }
    } catch (e) {
      console.error('Google sign-in failed', e);
      if (e.message && e.message.includes('Firebase not configured')) {
        alert('Firebase is not configured. Please check your environment variables and ensure Firebase is properly set up.');
      } else {
        alert(`Google sign-in failed: ${e.message || 'Please try again or use the form below.'}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to FlashQuiz+</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Create a quick profile so we can personalize your experience.</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 mt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 to-rose-500 text-white">Get Started</button>
            </div>
            <div className="mt-4">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">Or</div>
              <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:shadow">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span className="text-sm text-gray-700 dark:text-gray-100">Sign in with Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
