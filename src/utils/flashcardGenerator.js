/**
 * Rule-based flashcard generation from extracted text
 */

/**
 * Split text into sentences
 */
const splitIntoSentences = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.trim().length > 10);
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
        if (term.length > 3 && term.length < 40) {
          terms.add(term);
        }
      });
    }
  });
  
  return Array.from(terms);
};

/**
 * Extract definition sentences (sentences with "is", "are", "means", etc.)
 */
const extractDefinitionSentences = (sentences) => {
  return sentences.filter(sentence => {
    const lower = sentence.toLowerCase();
    return /(is|are|was|were|means|refers to|defined as)/.test(lower) &&
           sentence.length > 30 &&
           sentence.length < 200;
  });
};

/**
 * Create flashcard from definition sentence
 */
const createFlashcardFromDefinition = (sentence, keyTerms) => {
  // Find the term being defined
  for (const term of keyTerms) {
    if (sentence.toLowerCase().startsWith(term.toLowerCase() + ' ')) {
      const definition = sentence
        .replace(new RegExp(`^${term}\\s+`, 'i'), '')
        .replace(/^(is|are|was|were|means|refers to|defined as)\s+/i, '')
        .trim();
      
      if (definition.length > 10 && definition.length < 150) {
        return {
          front: term,
          back: definition,
          topic: extractTopic(sentence, keyTerms)
        };
      }
    }
  }
  
  return null;
};

/**
 * Create flashcard from sentence with key term
 */
const createFlashcardFromSentence = (sentence, keyTerms) => {
  for (const term of keyTerms) {
    if (sentence.toLowerCase().includes(term.toLowerCase()) && 
        sentence.length > 30 && 
        sentence.length < 200) {
      // Use the sentence as the answer, term as question
      const context = sentence.replace(new RegExp(term, 'gi'), '______');
      
      if (context !== sentence) {
        return {
          front: `What is ${term}?`,
          back: sentence,
          topic: term
        };
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
 * Generate flashcards from text
 */
export const generateFlashcards = (text, numCards = 20) => {
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

  const flashcards = [];
  const usedSentences = new Set();
  const usedTerms = new Set();

  // First, try to create flashcards from definition sentences
  const definitionSentences = extractDefinitionSentences(sentences);
  for (const sentence of definitionSentences) {
    if (flashcards.length >= numCards) break;
    if (usedSentences.has(sentence)) continue;

    const card = createFlashcardFromDefinition(sentence, keyTerms);
    if (card && !usedTerms.has(card.front)) {
      flashcards.push({
        id: flashcards.length + 1,
        ...card
      });
      usedSentences.add(sentence);
      usedTerms.add(card.front);
    }
  }

  // Then, create flashcards from other sentences with key terms
  for (const sentence of sentences) {
    if (flashcards.length >= numCards) break;
    if (usedSentences.has(sentence)) continue;

    const card = createFlashcardFromSentence(sentence, keyTerms);
    if (card && !usedTerms.has(card.front)) {
      flashcards.push({
        id: flashcards.length + 1,
        ...card
      });
      usedSentences.add(sentence);
      usedTerms.add(card.front);
    }
  }

  // If we still need more cards, create simple term-definition pairs
  if (flashcards.length < numCards) {
    const remaining = numCards - flashcards.length;
    const shuffledTerms = [...keyTerms].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(remaining, shuffledTerms.length); i++) {
      const term = shuffledTerms[i];
      if (usedTerms.has(term)) continue;

      // Find a sentence containing this term
      const containingSentence = sentences.find(s => 
        s.toLowerCase().includes(term.toLowerCase()) &&
        !usedSentences.has(s)
      );

      if (containingSentence) {
        flashcards.push({
          id: flashcards.length + 1,
          front: `What is ${term}?`,
          back: containingSentence,
          topic: term
        });
        usedTerms.add(term);
        usedSentences.add(containingSentence);
      }
    }
  }

  return flashcards.slice(0, numCards);
};
