import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Vocabulary from './components/Vocabulary';
import VocabularyDetails from './components/VocabularyDetails';
import Grammar from './components/Grammar';
import Game from './components/Game';
import AiSearch from './components/AiSearch';

import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function Layout() {

  const location = useLocation();

  // Hide navbar on login page
  const hideNavbar =
    location.pathname === '/' ||
    location.pathname === '/login';

  return (
    <>

      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* ROUTES */}
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* VOCABULARY */}
        <Route
          path="/vocabulary"
          element={
            <ProtectedRoute>
              <Vocabulary />
            </ProtectedRoute>
          }
        />

        {/* VOCABULARY DETAILS */}
        <Route
          path="/vocabulary/:id"
          element={
            <ProtectedRoute>
              <VocabularyDetails />
            </ProtectedRoute>
          }
        />

        {/* GRAMMAR */}
        <Route
          path="/grammar"
          element={
            <ProtectedRoute>
              <Grammar />
            </ProtectedRoute>
          }
        />

        {/* QUIZ */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />

        {/* 🤖 AI SEARCH */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AiSearch />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}