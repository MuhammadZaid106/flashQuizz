import React, { useState } from 'react';

const ShareQuiz = ({ quizData }) => {
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    // In a real app, this would generate a URL that encodes the quiz data
    // For now, we'll create a shareable JSON string
    const shareData = {
      questions: quizData.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      })),
      title: quizData.title || 'Shared Quiz'
    };
    
    const encoded = btoa(JSON.stringify(shareData));
    return `${window.location.origin}/share/${encoded}`;
  };

  const handleCopy = async () => {
    try {
      const shareLink = generateShareLink();
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FlashQuiz+ - Shared Quiz',
          text: 'Check out this quiz!',
          url: generateShareLink()
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopy();
    }
  };

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-surface fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Share Quiz
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Share this quiz with others so they can practice too!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleShare}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </button>
        <button
          onClick={handleCopy}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareQuiz;
