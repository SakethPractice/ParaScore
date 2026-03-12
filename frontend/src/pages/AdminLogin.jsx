import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLoginError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    
    // Simulate admin authentication
    setTimeout(() => {
      if (formData.username === 'admin' && formData.password === 'deltatime2024') {
        setIsLoggedIn(true);
      } else {
        setLoginError('Invalid credentials. Access denied.');
      }
      setIsLogging(false);
    }, 2000);
  };

  const isFormValid = formData.username && formData.password;

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
        {/* Matrix-like background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({length: 30}, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-[#00E5FF] font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px'
              }}
              animate={{
                y: ['0vh', '110vh']
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            >
              {Math.random().toString(36).substring(2, 15)}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-[#00E5FF] hover:text-[#FF4FD8] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">Exit Admin</span>
            </motion.button>

            <motion.button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <span>Logout</span>
              <Terminal className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Admin Dashboard */}
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="bg-[#151A3F] rounded-2xl border-2 border-[#00E5FF] p-8 relative overflow-hidden"
              style={{
                boxShadow: `
                  0 0 40px rgba(0,229,255,0.7),
                  inset 0 0 40px rgba(0,229,255,0.1)
                `
              }}
            >
              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 
                  className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B3FE4] mb-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  ADMIN CONTROL CENTER
                </h1>
                <p className="text-[#E6E8FF] flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5 text-[#00E5FF]" />
                  <span>System Administrator Access</span>
                </p>
              </motion.div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                {[
                  { title: 'Total Players', value: '247', icon: User, color: '#7B3FE4' },
                  { title: 'Active Games', value: '3', icon: Terminal, color: '#FF4FD8' },
                  { title: 'Recent Scores', value: '15', icon: Shield, color: '#00E5FF' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    className="bg-[#0B0F2F]/70 rounded-lg p-6 border border-[#7B3FE4]/30 hover:border-[#FF4FD8]/50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <h3 className="text-[#E6E8FF] font-semibold">{stat.title}</h3>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button 
                  className="bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white font-bold py-4 px-6 rounded-lg"
                  style={{ boxShadow: "0 0 20px rgba(123,63,228,0.7)" }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(123,63,228,0.9)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Manage Players
                </motion.button>
                
                <motion.button 
                  className="border-2 border-[#00E5FF] text-[#00E5FF] font-bold py-4 px-6 rounded-lg hover:bg-[#00E5FF] hover:text-[#0B0F2F] transition-colors"
                  style={{ boxShadow: "0 0 20px rgba(0,229,255,0.5)" }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(0,229,255,0.7)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Reports
                </motion.button>
              </motion.div>

              {/* System Status */}
              <motion.div 
                className="mt-8 bg-[#0B0F2F]/50 rounded-lg p-4 border border-[#00E5FF]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-[#00E5FF] font-semibold mb-2 flex items-center space-x-2">
                  <Terminal className="w-5 h-5" />
                  <span>System Status</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[#E6E8FF]">Database: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[#E6E8FF]">API: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[#E6E8FF]">Security: Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-[#E6E8FF]">Load: Medium</span>
                  </div>
                </div>
              </motion.div>

              {/* Scanline effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent opacity-5 h-2"
                animate={{ y: [0, 400, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0,229,255,0.3) 25%, rgba(0,229,255,0.3) 26%, transparent 27%, transparent 74%, rgba(0,229,255,0.3) 75%, rgba(0,229,255,0.3) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0,229,255,0.3) 25%, rgba(0,229,255,0.3) 26%, transparent 27%, transparent 74%, rgba(0,229,255,0.3) 75%, rgba(0,229,255,0.3) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Security scan lines */}
      <div className="absolute inset-0">
        {Array.from({length: 3}, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"
            animate={{
              y: [`${i * 33}vh`, `${(i + 1) * 33}vh`, `${i * 33}vh`]
            }}
            transition={{
              duration: 2,
              delay: i * 0.7,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 min-h-screen flex items-center justify-center">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center space-x-2 text-[#00E5FF] hover:text-[#FF4FD8] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Login Panel */}
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div 
            className="bg-[#151A3F] rounded-2xl p-8 border-2 border-[#00E5FF] relative overflow-hidden"
            style={{
              boxShadow: `
                0 0 40px rgba(0,229,255,0.7),
                inset 0 0 40px rgba(0,229,255,0.1)
              `
            }}
          >
            {/* Security corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#7B3FE4] rounded-tl-2xl opacity-60" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#7B3FE4] rounded-tr-2xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#7B3FE4] rounded-bl-2xl opacity-60" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#7B3FE4] rounded-br-2xl opacity-60" />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-16 h-16 text-[#00E5FF] mx-auto mb-4" />
              </motion.div>
              
              <h1 
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B3FE4] mb-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                ADMIN ACCESS
              </h1>
              <p className="text-[#E6E8FF] text-sm">
                Restricted Area • Authorization Required
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#00E5FF]" />
                  <span>Admin Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#00E5FF]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#7B3FE4] focus:outline-none transition-colors font-mono"
                  style={{
                    boxShadow: "inset 0 0 15px rgba(0,229,255,0.2)"
                  }}
                  placeholder="Enter admin username"
                  required
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#00E5FF]" />
                  <span>Admin Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-[#0B0F2F] border-2 border-[#00E5FF]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#7B3FE4] focus:outline-none transition-colors font-mono"
                    style={{
                      boxShadow: "inset 0 0 15px rgba(0,229,255,0.2)"
                    }}
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00E5FF] hover:text-[#FF4FD8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isLogging}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg relative overflow-hidden transition-all ${
                    isFormValid && !isLogging
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#7B3FE4] text-white cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    boxShadow: isFormValid && !isLogging ? "0 0 30px rgba(0,229,255,0.7)" : "none"
                  }}
                  whileHover={isFormValid && !isLogging ? { 
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(0,229,255,0.9)"
                  } : {}}
                  whileTap={isFormValid && !isLogging ? { scale: 0.98 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isLogging ? (
                      <motion.div
                        key="logging"
                        className="flex items-center justify-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>AUTHENTICATING...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login"
                        className="flex items-center justify-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Shield className="w-5 h-5" />
                        <span>LOGIN</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>

            {/* Security notice */}
            <motion.div 
              className="mt-6 text-center text-xs text-[#E6E8FF]/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p>All access attempts are logged and monitored</p>
              <p className="font-mono mt-1">Security Level: MAXIMUM</p>
            </motion.div>

            {/* Scanning effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent opacity-10 h-1"
              animate={{ y: [0, 300, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;