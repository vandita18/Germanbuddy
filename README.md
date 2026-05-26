# 🇩🇪 German Learning App

A React + TypeScript application for learning German through vocabulary practice, grammar lessons, and interactive quizzes.

## Features

- 📚 Vocabulary learning (A1–C1 levels)
- 📖 Grammar lessons with examples
- 🧠 Interactive quiz game
- 🔐 Authentication and protected routes
- ⭐ Favorite vocabulary words
- 📊 Quiz score tracking
- 🎨 Modern responsive UI

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- CSS

### Backend
- Node.js
- Express
- REST API

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── App.tsx

backend/
├── routes/
├── controllers/
├── middleware/
└── server.js
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd german-learning-app
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs at:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## API Endpoints

```http
GET  /api/vocabulary
GET  /api/grammar
GET  /api/quiz
POST /api/login
POST /api/register
```


## Author

**Vandita**

Frontend Developer | React | TypeScript
