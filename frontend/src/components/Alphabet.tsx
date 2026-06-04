import { useEffect, useState } from 'react';

import { getAlphabet } from '../services/api';

import type { AlphabetItem } from '../types';
import '../styles/Alphabet.css';

export default function Alphabet() {
  const [letters, setLetters] =
    useState<AlphabetItem[]>([]);

  const [section, setSection] =
    useState<'alphabet' | 'sounds'>(
      'alphabet'
    );

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadAlphabet();
  }, []);

  const loadAlphabet = async () => {
    try {
      setLoading(true);

      const data = await getAlphabet();

      setLetters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SPEECH (FIXED - NO STOP BUG)
  // =========================
  const speak = (text: string) => {
    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang = 'de-DE';
    utterance.rate = 0.85;

    speechSynthesis.speak(
      utterance
    );
  };

  // =========================
  // FILTER API DATA
  // =========================
  const standardLetters =
    letters.filter(
      (item) =>
        item.type === 'letter'
    );

  // =========================
  // EXTRA LEARNING SOUNDS
  // =========================
  const germanSounds = [
    {
      sound: 'Ä',
      pronunciation: 'eh sound',
      example: 'Äpfel',
    },
    {
      sound: 'Ö',
      pronunciation:
        'like French eu',
      example: 'Öl',
    },
    {
      sound: 'Ü',
      pronunciation:
        'ee rounded lips',
      example: 'Übung',
    },
    {
      sound: 'ß',
      pronunciation: 'ss sound',
      example: 'Straße',
    },
    {
      sound: 'CH',
      pronunciation:
        'soft throat sound',
      example: 'ich',
    },
    {
      sound: 'SCH',
      pronunciation: 'sh',
      example: 'Schule',
    },
    {
      sound: 'SP',
      pronunciation: 'shp',
      example: 'Sport',
    },
    {
      sound: 'ST',
      pronunciation: 'sht',
      example: 'Straße',
    },
    {
      sound: 'EI',
      pronunciation: 'eye',
      example: 'Ei',
    },
    {
      sound: 'IE',
      pronunciation: 'ee',
      example: 'Liebe',
    },
    {
      sound: 'EU',
      pronunciation: 'oy',
      example: 'Europa',
    },
  ];

  return (
    <div>

      {/* =========================
          SECTION TABS
      ========================= */}

      <div className="alphabet-tabs">

        <button
          className={
            section === 'alphabet'
              ? 'active-tab'
              : ''
          }
          onClick={() =>
            setSection('alphabet')
          }
        >
          🔤 Alphabet
        </button>

        <button
          className={
            section === 'sounds'
              ? 'active-tab'
              : ''
          }
          onClick={() =>
            setSection('sounds')
          }
        >
          🔊 Special Sounds
        </button>

      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <p className="loading-text">
          Loading alphabet...
        </p>
      )}

      {/* =========================
          ALPHABET SECTION
      ========================= */}

      {section === 'alphabet' && (
        <div className="alphabet-grid">

          {standardLetters.map(
            (item) => (
              <div
                key={item.id}
                className="alphabet-card glass-card"
              >
                <h2>
                  {item.letter}
                </h2>

                <p>
                  <strong>
                    Name:
                  </strong>{' '}
                  {item.name}
                </p>

                <p>
                  <strong>
                    IPA:
                  </strong>{' '}
                  {item.ipa}
                </p>

                <p>
                  {item.example_word_de}
                </p>

                <p>
                  {item.example_word_en}
                </p>

                <button
                  onClick={() =>
                    speak(
                      `${item.letter}. ${item.example_word_de}`
                    )
                  }
                >
                  🔊 Listen
                </button>

              </div>
            )
          )}

        </div>
      )}

      {/* =========================
          SPECIAL SOUNDS SECTION
      ========================= */}

      {section === 'sounds' && (
        <div className="alphabet-grid">

          {germanSounds.map(
            (item, index) => (
              <div
                key={index}
                className="alphabet-card glass-card"
              >
                <h2>
                  {item.sound}
                </h2>

                <p>
                  {item.pronunciation}
                </p>

                <p>
                  Example:{' '}
                  {item.example}
                </p>

                <button
                  onClick={() =>
                    speak(
                      `${item.sound}. ${item.example}`
                    )
                  }
                >
                  🔊 Listen
                </button>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}