import React, { useState, useEffect } from 'react';
import Timer from './Timer';

const Quiz = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (quizStarted && !timerActive) {
      setTimerActive(true);
    }
  }, [quizStarted, timerActive]);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No questions available. Please upload a document to generate questions.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
    
    setShowFeedback(true);
    
    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
      } else {
        handleQuizComplete();
      }
    }, 2000);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
    }
  };

  const handleQuizComplete = () => {
    setTimerActive(false);
    const results = calculateResults();
    onQuizComplete(results, timeElapsed);
  };

  const calculateResults = () => {
    const correct = questions.filter(
      (q, index) => selectedAnswers[index] === q.correctAnswer
    ).length;
    
    const topicPerformance = {};
    questions.forEach((q, index) => {
      const topic = q.topic || 'General';
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      topicPerformance[topic].total++;
      if (selectedAnswers[index] === q.correctAnswer) {
        topicPerformance[topic].correct++;
      }
    });

    return {
      total: questions.length,
      correct,
      incorrect: questions.length - correct,
      score: Math.round((correct / questions.length) * 100),
      topicPerformance,
      questions,
      answers: selectedAnswers
    };
  };

  if (!quizStarted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Quiz Ready!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            You have <span className="font-bold text-purple-600 dark:text-purple-400">{questions.length}</span> questions to answer. Take your time and do your best!
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 large-touch"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 card-surface fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            {timerActive && (
              <Timer
                onTimeUpdate={setTimeElapsed}
                isActive={timerActive}
              />
            )}
          </div>
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

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>
        
        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (showFeedback) {
              if (isCorrectOption) {
                buttonClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
              } else {
                buttonClass += "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-60";
              }
            } else {
              if (isSelected) {
                buttonClass += "bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-800 dark:text-purple-300";
              } else {
                buttonClass += "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-rose-400 dark:hover:border-rose-500 text-gray-800 dark:text-white cursor-pointer";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && isCorrectOption && (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedAnswer && !showFeedback}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
