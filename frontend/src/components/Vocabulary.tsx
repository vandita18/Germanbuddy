import { useState } from 'react';

import { searchVocabulary } from '../services/api';

import '../styles/vocabulary.css';

export interface VocabularyItem {
  german: string;
  english: string;
  pos?: string;
  example_de?: string;
  example_en?: string;
  level?: string;
}

const Vocabulary = () => {

  const [search, setSearch] =
    useState('');

  const [level, setLevel] =
    useState('A1');

  const [words, setWords] =
    useState<VocabularyItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // USER
  // =========================

  const user = JSON.parse(
    localStorage.getItem(
      'loggedInUser'
    ) || '{}'
  );

  const userId =
    user?.email || user?.name || 'guest';

  const favoriteKey =
    `favoriteWords_${userId}`;

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async () => {

    try {

      setLoading(true);

      const data =
        await searchVocabulary(
          search,
          level
        );

      setWords(data || []);

    } catch (error) {

      console.error(error);

      setWords([]);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // SAVE FAVORITE
  // =========================

  const saveFavorite = (
    word: VocabularyItem
  ) => {

    const existing =
      JSON.parse(
        localStorage.getItem(
          favoriteKey
        ) || '[]'
      );

    const alreadyExists =
      existing.some(
        (item: VocabularyItem) =>
          item.german === word.german
      );

    if (alreadyExists) {
      alert('Already saved ❤️');
      return;
    }

    const updated = [
      ...existing,
      word
    ];

    localStorage.setItem(
      favoriteKey,
      JSON.stringify(updated)
    );

    // DASHBOARD REFRESH
    window.dispatchEvent(
      new Event('storage')
    );

    alert(
      `${word.german} saved ❤️`
    );
  };

  return (
    <div className="page-container">

      <h1 className="page-title">
        📚 Vocabulary
      </h1>

      {/* SEARCH */}

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search German word..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
        </select>

        <button
          className="search-btn"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <p className="loading-text">
          Loading vocabulary...
        </p>
      )}

      {/* WORDS */}

      <div className="vocab-grid">

        {words.map((word, index) => (

          <div
            key={`${word.german}-${index}`}
            className="vocab-card glass-card"
          >

            <h2>{word.german}</h2>

            <p>{word.english}</p>

            {word.level && (
              <p className="level-tag">
                {word.level}
              </p>
            )}

            {word.pos && (
              <p>
                <strong>POS:</strong>{' '}
                {word.pos}
              </p>
            )}

            {word.example_de && (
              <p>
                🇩🇪 {word.example_de}
              </p>
            )}

            {word.example_en && (
              <p>
                🇬🇧 {word.example_en}
              </p>
            )}

            <button
              className="favorite-btn"
              onClick={() =>
                saveFavorite(word)
              }
            >
              ❤️ Save
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Vocabulary;