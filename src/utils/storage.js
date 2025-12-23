/**
 * Local storage utilities for saving quiz data and settings
 */

const keyFor = (user, key) => `flashquiz_${user || 'default'}_${key}`;

export const saveQuizData = (quizData, user = 'default') => {
  try {
    localStorage.setItem(keyFor(user, 'quiz_data'), JSON.stringify(quizData));
  } catch (error) {
    console.error('Error saving quiz data:', error);
  }
};

export const getQuizData = (user = 'default') => {
  try {
    const data = localStorage.getItem(keyFor(user, 'quiz_data'));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving quiz data:', error);
    return null;
  }
};

export const saveFlashcardData = (flashcardData, user = 'default') => {
  try {
    localStorage.setItem(keyFor(user, 'flashcard_data'), JSON.stringify(flashcardData));
  } catch (error) {
    console.error('Error saving flashcard data:', error);
  }
};

export const getFlashcardData = (user = 'default') => {
  try {
    const data = localStorage.getItem(keyFor(user, 'flashcard_data'));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving flashcard data:', error);
    return null;
  }
};

export const saveQuizResults = (results, user = 'default') => {
  try {
    const existingResults = getQuizResults(user);
    const updatedResults = [...(existingResults || []), results];
    localStorage.setItem(keyFor(user, 'results'), JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Error saving quiz results:', error);
  }
};

export const getQuizResults = (user = 'default') => {
  try {
    const data = localStorage.getItem(keyFor(user, 'results'));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving quiz results:', error);
    return [];
  }
};

export const clearAllData = (user = 'default') => {
  try {
    localStorage.removeItem(keyFor(user, 'quiz_data'));
    localStorage.removeItem(keyFor(user, 'flashcard_data'));
    localStorage.removeItem(keyFor(user, 'results'));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const getTheme = () => {
  try {
    return localStorage.getItem('flashquiz_theme') || 'light';
  } catch (error) {
    return 'light';
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem('flashquiz_theme', theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getUsers = () => {
  try {
    const raw = localStorage.getItem('flashquiz_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem('flashquiz_users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users', e);
  }
};

export const getCurrentUser = () => {
  try {
    return localStorage.getItem('flashquiz_current_user') || 'default';
  } catch (e) {
    return 'default';
  }
};

export const setCurrentUser = (user) => {
  try {
    localStorage.setItem('flashquiz_current_user', user);
  } catch (e) {
    console.error('Error setting current user', e);
  }
};

// User profiles (store name + email map)
export const getUserProfiles = () => {
  try {
    const raw = localStorage.getItem('flashquiz_user_profiles');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveUserProfiles = (profiles) => {
  try {
    localStorage.setItem('flashquiz_user_profiles', JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving user profiles', e);
  }
};

export const getUserProfile = (user) => {
  try {
    const map = getUserProfiles();
    return map[user] || null;
  } catch (e) {
    return null;
  }
};

export const saveUserProfile = (user, profile) => {
  try {
    const map = getUserProfiles();
    map[user] = profile;
    saveUserProfiles(map);
  } catch (e) {
    console.error('Error saving user profile', e);
  }
};
