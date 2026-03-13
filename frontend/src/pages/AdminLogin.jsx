import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertCircle, LogOut, Trash2, RotateCcw, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if already logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token') && localStorage.getItem('role') === 'admin');
  
  // Dashboard state
  const [scores, setScores] = useState([]);
  const [activeTab, setActiveTab] = useState('scores');
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Load admin data
  useEffect(() => {
    if (isLoggedIn) {
      loadAdminData();
    }
  }, [isLoggedIn]);

  const loadAdminData = async () => {
    try {
      setLoadingDashboard(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const scoresRes = await API.get('/admin/scores', config);
      setScores(scoresRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await API.post('/auth/admin/login', {
        username,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', 'admin');
      
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setScores([]);
    navigate('/');
  };

  const deleteScore = async (scoreId) => {
    if (!window.confirm('Are you sure you want to delete this score?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/admin/scores/${scoreId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(scores.filter(s => s.id !== scoreId));
    } catch (err) {
      alert('Failed to delete score');
    }
  };

  const resetLeaderboard = async (gameId) => {
    if (!window.confirm(`Are you sure you want to reset the ${gameId} leaderboard? All scores will be deleted.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/admin/leaderboard/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScores(scores.filter(s => s.game !== gameId));
    } catch (err) {
      alert('Failed to reset leaderboard');
    }
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F]">
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="bg-[#151A3F] p-8 rounded-xl border border-[#7B3FE4]/50">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-[#FF4FD8] mr-3" />
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]">
                Admin Panel
              </h2>
            </div>

            <p className="text-center text-[#00E5FF] mb-6 text-sm">
              Manage leaderboards and scores
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[#00E5FF] text-sm mb-2">Username</label>
              <div className="flex items-center bg-[#0B0F2F] rounded border border-[#7B3FE4]/30">
                <User className="w-5 h-5 text-[#00E5FF] ml-3" />
                <input
                  type="text"
                  placeholder="admin"
                  className="w-full ml-2 p-3 bg-transparent outline-none text-white placeholder-[#7B3FE4]/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#00E5FF] text-sm mb-2">Password</label>
              <div className="flex items-center bg-[#0B0F2F] rounded border border-[#7B3FE4]/30">
                <Lock className="w-5 h-5 text-[#00E5FF] ml-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full ml-2 p-3 bg-transparent outline-none text-white placeholder-[#7B3FE4]/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-3 text-[#00E5FF]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] p-3 rounded font-bold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full mt-4 flex items-center justify-center text-[#00E5FF] hover:text-[#FF4FD8] transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>

            <div className="mt-6 p-3 bg-[#0B0F2F] rounded text-xs text-[#00E5FF]">
              <p className="font-bold mb-2">Demo Credentials:</p>
              <p>admin / deltatime2024</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-[#FF4FD8] mr-3" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded border border-red-500/50 transition font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === 'scores'
                ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white'
                : 'bg-[#151A3F] text-[#00E5FF] hover:bg-[#1A1F4A]'
            }`}
          >
            All Scores
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white'
                : 'bg-[#151A3F] text-[#00E5FF] hover:bg-[#1A1F4A]'
            }`}
          >
            Manage Leaderboards
          </button>
        </div>

        {/* Content */}
        {loadingDashboard ? (
          <div className="text-center text-[#00E5FF]">Loading...</div>
        ) : activeTab === 'scores' ? (
          // Scores Tab
          <motion.div
            className="bg-[#151A3F] rounded-xl p-6 border border-[#7B3FE4]/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-[#00E5FF] mb-4">All Scores ({scores.length})</h2>
            
            {scores.length === 0 ? (
              <p className="text-[#7B3FE4]">No scores yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#7B3FE4]/30">
                      <th className="text-left p-3 text-[#00E5FF]">Player</th>
                      <th className="text-left p-3 text-[#00E5FF]">SRN</th>
                      <th className="text-left p-3 text-[#00E5FF]">Score</th>
                      <th className="text-left p-3 text-[#00E5FF]">Game</th>
                      <th className="text-left p-3 text-[#00E5FF]">Date</th>
                      <th className="text-left p-3 text-[#00E5FF]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score) => (
                      <tr key={score.id} className="border-b border-[#7B3FE4]/10 hover:bg-[#0B0F2F] transition">
                        <td className="p-3 text-white">{score.playerName}</td>
                        <td className="p-3 text-[#00E5FF]">{score.srn}</td>
                        <td className="p-3 text-[#FF4FD8] font-bold">{score.score}</td>
                        <td className="p-3 text-[#00E5FF]">{score.game}</td>
                        <td className="p-3 text-[#7B3FE4]">{new Date(score.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteScore(score.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete score"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          // Manage Tab
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {['NFS', 'ALTOS', 'ULTRAKILL'].map((game) => (
              <div key={game} className="bg-[#151A3F] rounded-xl p-6 border border-[#7B3FE4]/50">
                <h3 className="text-xl font-bold text-[#00E5FF] mb-4">{game}</h3>
                <p className="text-sm text-[#7B3FE4] mb-4">
                  {scores.filter(s => s.game === game).length} score(s)
                </p>
                <button
                  onClick={() => resetLeaderboard(game)}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded border border-red-500/50 transition font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Leaderboard
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
