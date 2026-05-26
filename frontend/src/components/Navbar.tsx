import { Link, useNavigate } from 'react-router-dom';

import '../styles/Navbar.css';

export default function Navbar() {

  const navigate = useNavigate();

  const user = localStorage.getItem('loggedInUser');

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        🇩🇪 GermanBuddy
      </div>

      {/* NAVIGATION */}
      <div className="nav-links">

        {!user ? (

          <>
            <Link className="nav-item vocabulary" to="/login">
              Login
            </Link>
          </>

        ) : (

          <>

            <Link className="nav-item dashboard" to="/dashboard">
              Dashboard
            </Link>

            <Link className="nav-item vocabulary" to="/vocabulary">
              Vocabulary
            </Link>

            <Link className="nav-item grammar" to="/grammar">
              Grammar
            </Link>

            <Link className="nav-item quiz" to="/game">
              Quiz
            </Link>

            {/* ✅ AI SEARCH BUTTON ADDED */}
            <Link className="nav-item ai" to="/ai">
              🤖 AI Tutor
            </Link>

            <button
              className="nav-item logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>
  );
}