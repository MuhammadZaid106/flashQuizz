import React from 'react';

const Statistics = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
          No quiz results yet.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Complete a quiz to see your statistics!
        </p>
      </div>
    );
  }

  // Calculate overall statistics
  const totalQuizzes = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalCorrect = results.reduce((sum, r) => sum + (r.correct || 0), 0);
  const averageScore = totalQuestions > 0 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;

  // Calculate topic performance across all quizzes
  const topicStats = {};
  results.forEach(result => {
    if (result.topicPerformance) {
      Object.entries(result.topicPerformance).forEach(([topic, stats]) => {
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        topicStats[topic].correct += stats.correct;
        topicStats[topic].total += stats.total;
      });
    }
  });

  // Sort topics by performance (worst first)
  const weakTopics = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      score: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-surface fade-in">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Overall Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
            <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">
              Total Quizzes
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {totalQuizzes}
            </div>
          </div>
          
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 border border-rose-100 dark:border-rose-900/30">
            <div className="text-rose-600 dark:text-rose-400 text-sm font-medium mb-1">
              Questions Attempted
            </div>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
              {totalQuestions}
            </div>
          </div>
          
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-100 dark:border-pink-900/30">
            <div className="text-pink-600 dark:text-pink-400 text-sm font-medium mb-1">
              Correct Answers
            </div>
            <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">
              {totalCorrect}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">
              Average Score
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
              {averageScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-surface fade-in">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Areas to Review
          </h2>
          
          <div className="space-y-4">
            {weakTopics.map((item, index) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {item.topic}
                  </h3>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {item.correct} out of {item.total} questions correct
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quiz Results */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-surface fade-in">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Recent Quiz Results
        </h2>
        
        <div className="space-y-4">
          {results.slice(0, 5).map((result, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Quiz #{results.length - index}
                  </span>
                  {result.timeElapsed && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                      Time: {formatTime(result.timeElapsed)}
                    </span>
                  )}
                </div>
                <span
                  className={`text-lg font-bold ${
                    result.score >= 70
                      ? 'text-green-600 dark:text-green-400'
                      : result.score >= 50
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {result.score}%
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {result.correct} correct out of {result.total} questions
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
