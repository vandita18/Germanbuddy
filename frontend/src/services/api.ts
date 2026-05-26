import axios from 'axios';

const API_URL = 'https://german-language.onrender.com';

const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  'X-API-Key': API_KEY,
};

//
// ---------------- VOCABULARY SEARCH ----------------
//
export const searchVocabulary = async (
  search: string,
  level: string
) => {
  try {
    const res = await axios.get(`${API_URL}/vocab/search`, {
      params: {
        q: search,
        level,
        limit: 50,
      },
      headers,
    });

    return res.data.data || [];
  } catch (err) {
    console.error('Vocabulary error:', err);
    return [];
  }
};

//
// ---------------- GRAMMAR ----------------
export const searchGrammar = async (
  category: string
) => {
  try {
    const res = await axios.get(
      `${API_URL}/grammar`,
      {
        params: {
          category,
          limit: 50,
          offset: 0,
        },
        headers,
      }
    );

    return res.data.data || [];
  } catch (err) {
    console.error(
      'Grammar API error:',
      err
    );

    return [];
  }
};

//
// ---------------- VOCAB BY LEVEL ----------------
//
export const getVocabularyByLevel = async (level: string) => {
  try {
    const res = await axios.get(`${API_URL}/vocab`, {
      params: {
        level,
        limit: 100,
        offset: 0,
      },
      headers,
    });

    return res.data.data || [];
  } catch (err) {
    console.error('Vocabulary by level error:', err);
    return [];
  }
};

//
// ---------------- QUIZ ----------------
//
export const getQuiz = async (level: string) => {
  try {
    const res = await axios.get(`${API_URL}/quiz`, {
      params: { level },
      headers,
    });

    return res.data.data || [];
  } catch (err) {
    console.error('Quiz error:', err);
    return [];
  }
};
export const getRandomSentences = async (
  level: string
) => {
  try {
    const res = await axios.get(
      `${API_URL}/sentences/random`,
      {
        params: {
          level: level.toUpperCase(),
          count: 10,
        },
        headers,
      }
    );

    return res.data.data || [];
  } catch (err) {
    console.error(
      'Sentence API error:',
      err
    );

    return [];
  }
};

//
// ---------------- ALPHABET ----------------
//

export const getAlphabet = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/alphabet`,
      {
        headers,
      }
    );

    return res.data.data || [];
  } catch (err) {
    console.error(
      'Alphabet API error:',
      err
    );

    return [];
  }
};