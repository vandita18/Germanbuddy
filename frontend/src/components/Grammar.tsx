import { useState } from 'react';

import { searchGrammar } from '../services/api';

import Alphabet from '../components/Alphabet';

import '../styles/grammar.css';

export default function Grammar() {

  const [category, setCategory] =
    useState('cases');

  const [grammar, setGrammar] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [showAlphabet, setShowAlphabet] =
    useState(false);

  const handleSearch = async () => {

    try {

      setShowAlphabet(false);

      setLoading(true);

      const data =
        await searchGrammar(category);

      setGrammar(data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <h1 className="page-title">
        📚 Grammar
      </h1>

      <div className="search-bar">

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="cases">
            Cases
          </option>

          <option value="articles">
            Articles
          </option>

          <option value="verbs">
            Verbs
          </option>

          <option value="word order">
            Word Order
          </option>

          <option value="prepositions">
            Prepositions
          </option>

          <option value="tenses">
            Tenses
          </option>

        </select>

        <button
          className="btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>

        <button
          className="btn-primary"
          onClick={() =>
            setShowAlphabet(true)
          }
        >
          🔤 Alphabet
        </button>

      </div>

      {loading && (
        <p className="loading-text">
          Loading grammar...
        </p>
      )}

      {showAlphabet ? (

        <Alphabet />

      ) : (

        <div className="grammar-grid">

          {grammar.map((item) => (

            <div
              key={item.id}
              className="grammar-card glass-card"
            >

              <h2>
                {item.category_name}
              </h2>

              <h3>
                {item.subcategory}
              </h3>

              <p>
                <strong>
                  German Rule:
                </strong>{' '}
                {item.rule_german}
              </p>

              <p>
                <strong>
                  English Rule:
                </strong>{' '}
                {item.rule_english}
              </p>

              <div className="example-box">

                <p>
                  🇩🇪 {item.example_de}
                </p>

                <p>
                  🇬🇧 {item.example_en}
                </p>

              </div>

              <p className="notes">
                💡 {item.notes}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}