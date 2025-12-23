import React, { useState, useEffect } from 'react';

const Flashcard = ({ flashcards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());
  const [reviewCards, setReviewCards] = useState(new Set());

  // Keyboard navigation: left/right to navigate, space to flip
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((i) => {
          if (i < flashcards.length - 1) {
            setIsFlipped(false);
            return i + 1;
          }
          // complete
          handleComplete();
          return i;
        });
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((i) => (i > 0 ? i - 1 : i));
        setIsFlipped(false);
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flashcards, handleComplete]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No flashcards available. Please upload a document to generate flashcards.
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    setKnownCards(new Set([...knownCards, currentIndex]));
    handleNext();
  };

  const handleReview = () => {
    setReviewCards(new Set([...reviewCards, currentIndex]));
    handleNext();
  };

  const handleComplete = () => {
    onComplete({
      total: flashcards.length,
      known: knownCards.size,
      review: reviewCards.size,
      flashcards
    });
  };

  const formatText = (text) => {
    if (!text) return '';
    // Split long text into paragraphs if needed
    if (text.length > 200) {
      return text
        .split('.')
        .map((sentence, index, array) => {
          if (index === array.length - 1 && !sentence.trim()) return null;
          return sentence.trim() + (index < array.length - 1 ? '.' : '');
        })
        .filter(Boolean)
        .join('\n\n');
    }
    return text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 card-surface fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Flashcard {currentIndex + 1} of {flashcards.length}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <div
          className="relative h-64 md:h-80 perspective-1000 cursor-pointer"
          onClick={handleFlip}
        >
          <div
            className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-500 to-rose-500 rounded-lg shadow-xl p-8 flex items-center justify-center"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="text-center">
                <p className="text-white text-xl md:text-2xl font-semibold">
                  {currentCard.front}
                </p>
                <p className="text-white/80 text-sm mt-4">
                  Click to flip
                </p>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full backface-hidden bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg shadow-xl p-8 flex items-center justify-center rotate-y-180"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <p className="text-white text-lg md:text-xl whitespace-pre-line">
                  {formatText(currentCard.back)}
                </p>
                <p className="text-white/80 text-sm mt-4">
                  Click to flip back
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        {isFlipped && (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleReview}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors large-touch"
            >
              Review Later
            </button>
            <button
              onClick={handleKnown}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors large-touch"
            >
              I Know This
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handleFlip}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-lg transition-colors"
        >
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </button>
        
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition-colors"
        >
          {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <span className="text-green-600 dark:text-green-400">
          Known: {knownCards.size}
        </span>
        <span className="text-yellow-600 dark:text-yellow-400">
          Review: {reviewCards.size}
        </span>
      </div>
    </div>
  );
};

export default Flashcard;
