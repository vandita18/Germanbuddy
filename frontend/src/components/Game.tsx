import { useEffect, useState } from 'react';
import { getRandomSentences } from '../services/api';

import '../styles/game.css';

interface QuizItem {
  sentence_de: string;
  sentence_en: string;
  options: string[];
}

export default function Game() {
  const [data, setData] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selected, setSelected] =
    useState<string | null>(null);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem('loggedInUser') || '{}'
  );

  const userId =
    user?.email || user?.name || 'guest';

  const level =
    localStorage.getItem(
      `selectedLevel_${userId}`
    ) || 'A1';

  useEffect(() => {
    loadQuiz();
  }, [level]);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const sentences =
        await getRandomSentences(level);

      const quizData = sentences.map(
        (item: any) => {
          const correct =
            item.sentence_en;

          const wrongOptions = sentences
            .filter(
              (s: any) =>
                s.sentence_en !== correct
            )
            .map(
              (s: any) =>
                s.sentence_en
            )
            .sort(
              () => 0.5 - Math.random()
            )
            .slice(0, 3);

          return {
            sentence_de:
              item.sentence_de,

            sentence_en:
              item.sentence_en,

            options: [
              correct,
              ...wrongOptions,
            ].sort(
              () => 0.5 - Math.random()
            ),
          };
        }
      );

      setData(quizData);

      setIndex(0);
      setScore(0);

      setSelected(null);
      setShowAnswer(false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const answer = (option: string) => {
    if (showAnswer) return;

    setSelected(option);
    setShowAnswer(true);

    let newScore = score;

    if (option === data[index].sentence_en) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {

      setSelected(null);
      setShowAnswer(false);

      if (index < data.length - 1) {
        setIndex((i) => i + 1);
      } else {

        const key =
          `bestScore_${userId}`;

        const saved =
          Number(
            localStorage.getItem(key) || 0
          );

        if (newScore > saved) {
          localStorage.setItem(
            key,
            String(newScore)
          );
        }

        window.dispatchEvent(
          new Event('storage')
        );

        setIndex(data.length);
      }

    }, 700);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">
          Loading Quiz...
        </h2>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">
          No Quiz Found
        </h2>
      </div>
    );
  }

  if (index >= data.length) {
    return (
      <div className="result-card">

        <h1>🎉 Quiz Completed</h1>

        <h2>
          Great Job {user.name}
        </h2>

        <h3>
          Score: {score} / {data.length}
        </h3>

        <button
          className="btn-primary"
          onClick={loadQuiz}
        >
          Play Again
        </button>

      </div>
    );
  }

  const q = data[index];

  return (
    <div className="quiz-container">

      <h1 className="quiz-title">
        🎮 German Quiz
      </h1>

      <div className="quiz-card">

        <div className="quiz-stats">

          <div className="stat-box">
            Question {index + 1} / {data.length}
          </div>

          <div className="stat-box">
            Score: {score}
          </div>

          <div className="stat-box">
            Level: {level}
          </div>

        </div>

        <h2 className="question-text">
          {q.sentence_de}
        </h2>

        <div className="quiz-options">

          {q.options.map(
            (option, i) => (
              <button
                key={i}
                className={`
                  option-btn
                  ${
                    selected === option
                      ? 'selected'
                      : ''
                  }
                  ${
                    showAnswer &&
                    option === q.sentence_en
                      ? 'correct'
                      : ''
                  }
                  ${
                    showAnswer &&
                    selected === option &&
                    option !== q.sentence_en
                      ? 'wrong'
                      : ''
                  }
                `}
                onClick={() =>
                  answer(option)
                }
              >
                {option}
              </button>
            )
          )}

        </div>

      </div>

    </div>
  );
}