import { useEffect, useState } from 'react';
import { getQuiz } from '../services/api';
import type { QuizQuestion } from '../types';

const useGermanGame = (level: string) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const data = await getQuiz(level);

        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Quiz fetch error:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [level]);

  return {
    questions,
    loading,
  };
};

export default useGermanGame;