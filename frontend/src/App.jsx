import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import SubmitScore from './pages/SubmitScore';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';

// Import styles
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/submit-score" element={<SubmitScore />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </div>
  );
}

export default App;