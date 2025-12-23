/**
 * Rule-based quiz generation from extracted text
 */

/**
 * Split text into sentences
 */
const splitIntoSentences = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.trim().length > 20)
    .slice(0, 50); // Limit to first 50 sentences for performance
};

/**
 * Extract key terms and concepts
 */
const extractKeyTerms = (sentences) => {
  const terms = new Set();
  
  sentences.forEach(sentence => {
    // Extract capitalized words (likely proper nouns or important terms)
    const capitalized = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (capitalized) {
      capitalized.forEach(term => {
        if (term.length > 3 && term.length < 30) {
          terms.add(term);
        }
      });
    }
    
    // Extract words after "is", "are", "was", "were", "means", "refers to"
    const definitions = sentence.match(/\b(is|are|was|were|means|refers to)\s+([^.]+)/gi);
    if (definitions) {
      definitions.forEach(def => {
        const parts = def.split(/\s+/).slice(1);
        if (parts.length > 0 && parts.length < 8) {
          terms.add(parts.join(' ').trim());
        }
      });
    }
  });
  
  return Array.from(terms).slice(0, 30);
};

/**
 * Generate distractors for multiple-choice questions
 */
const generateDistractors = (correctAnswer, allTerms) => {
  const distractors = [];
  const used = new Set([correctAnswer]);
  
  // Get random terms that are different from correct answer
  const shuffled = [...allTerms].sort(() => Math.random() - 0.5);
  
  for (const term of shuffled) {
    if (distractors.length >= 3) break;
    if (!used.has(term) && term.toLowerCase() !== correctAnswer.toLowerCase()) {
      // Check for similarity to avoid too similar options
      const similarity = calculateSimilarity(term, correctAnswer);
      if (similarity < 0.5) {
        distractors.push(term);
        used.add(term);
      }
    }
  }
  
  // Fill remaining slots with generic distractors if needed
  while (distractors.length < 3) {
    const generic = ['None of the above', 'All of the above', 'Not mentioned'];
    for (const gen of generic) {
      if (distractors.length >= 3) break;
      if (!distractors.includes(gen)) {
        distractors.push(gen);
      }
    }
    break;
  }
  
  return distractors.slice(0, 3);
};

/**
 * Calculate similarity between two strings
 */
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
};

/**
 * Calculate edit distance (Levenshtein distance)
 */
const editDistance = (str1, str2) => {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
};

/**
 * Generate a question from a sentence
 */
const generateQuestionFromSentence = (sentence, keyTerms) => {
  // Try to find a key term in the sentence
  for (const term of keyTerms) {
    if (sentence.toLowerCase().includes(term.toLowerCase())) {
      // Create a fill-in-the-blank style question
      const questionText = sentence.replace(
        new RegExp(term, 'gi'),
        '________'
      );
      
      if (questionText !== sentence && questionText.length > 20) {
        const distractors = generateDistractors(term, keyTerms);
        const options = [term, ...distractors].sort(() => Math.random() - 0.5).slice(0, 4);
        
        // Ensure we have at least 2 options
        if (options.length >= 2) {
          return {
            question: questionText.trim(),
            options,
            correctAnswer: term,
            topic: extractTopic(sentence, keyTerms)
          };
        }
      }
    }
  }
  
  return null;
};

/**
 * Extract topic from sentence
 */
const extractTopic = (sentence, keyTerms) => {
  for (const term of keyTerms) {
    if (sentence.toLowerCase().includes(term.toLowerCase())) {
      return term;
    }
  }
  return 'General';
};

/**
 * Generate multiple-choice questions from text
 */
export const generateQuiz = (text, numQuestions = 10) => {
  if (!text || text.trim().length < 100) {
    return [];
  }

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    return [];
  }

  const keyTerms = extractKeyTerms(sentences);
  if (keyTerms.length === 0) {
    return [];
  }

  const questions = [];
  const usedSentences = new Set();

  // Generate questions from sentences
  for (const sentence of sentences) {
    if (questions.length >= numQuestions) break;
    if (usedSentences.has(sentence)) continue;

    const question = generateQuestionFromSentence(sentence, keyTerms);
    if (question) {
      questions.push({
        id: questions.length + 1,
        ...question
      });
      usedSentences.add(sentence);
    }
  }

  // If we don't have enough questions, create definition-based questions
  if (questions.length < numQuestions && keyTerms.length > 0) {
    const remaining = numQuestions - questions.length;
    const usedTerms = new Set(questions.map(q => q.correctAnswer));

    for (let i = 0; i < Math.min(remaining, keyTerms.length); i++) {
      const term = keyTerms[i];
      if (usedTerms.has(term)) continue;

      const distractors = generateDistractors(term, keyTerms);
      const options = [term, ...distractors].sort(() => Math.random() - 0.5).slice(0, 4);
      
      // Only add question if we have at least 2 options
      if (options.length >= 2) {
        const question = {
          id: questions.length + 1,
          question: `What is ${term}?`,
          options,
          correctAnswer: term,
          topic: term
        };
        questions.push(question);
      }
      usedTerms.add(term);
    }
  }

  return questions.slice(0, numQuestions);
};
