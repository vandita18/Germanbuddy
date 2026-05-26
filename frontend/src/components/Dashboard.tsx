import { useEffect, useState } from 'react';

import '../styles/Dashboard.css';

const Dashboard = () => {

  const user = JSON.parse(
    localStorage.getItem('loggedInUser') || '{}'
  );

  const userId =
    user?.email || user?.name || 'guest';

  const [bestScore, setBestScore] =
    useState(0);

  const [favoriteCount, setFavoriteCount] =
    useState(0);

  const [currentLevel, setCurrentLevel] =
    useState('A1');

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {

    const loadDashboard = () => {

      // BEST SCORE
      const savedBest =
        Number(
          localStorage.getItem(
            `bestScore_${userId}`
          ) || 0
        );

      setBestScore(savedBest);

      // FAVORITES
      const favorites =
        JSON.parse(
          localStorage.getItem(
            `favoriteWords_${userId}`
          ) || '[]'
        );

      setFavoriteCount(favorites.length);

      // LEVEL
      const savedLevel =
        localStorage.getItem(
          `selectedLevel_${userId}`
        ) || 'A1';

      setCurrentLevel(savedLevel);
    };

    loadDashboard();

    // LIVE UPDATE
    window.addEventListener(
      'storage',
      loadDashboard
    );

    return () => {
      window.removeEventListener(
        'storage',
        loadDashboard
      );
    };

  }, []);

  return (
    <div className="page-container">

      <div className="dashboard-container">

        <h1 className="page-title dashboard-title">
          Willkommen {user.name || 'Learner'} 👋
        </h1>

        <div className="stats-grid">

          {/* BEST SCORE */}

          <div className="stats-card glass-card">

            <h2>🏆 Best Quiz Score</h2>

            <p>{bestScore}</p>

          </div>

          {/* FAVORITES */}

          <div className="stats-card glass-card">

            <h2>❤️ Favorite Words</h2>

            <p>{favoriteCount}</p>

          </div>

          {/* LEVEL */}

          <div className="stats-card glass-card">

            <h2>📘 Current Level</h2>

            <p>{currentLevel}</p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;