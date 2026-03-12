import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, ArrowLeft, Gamepad2, User, Hash, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitScore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: '',
    srn: '',
    game: '',
    score: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheaterWarning, setShowCheaterWarning] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const games = [
    { id: 'NFS', name: 'Need for Speed' },
    { id: 'ALTOS', name: 'Altos Adventure' },
    { id: 'SUBWAY', name: 'Subway Surfers' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock cheater detection (random for demo)
      const isCheater = Math.random() < 0.2; // 20% chance for demo
      
      if (isCheater) {
        setShowCheaterWarning(true);
        setTimeout(() => setShowCheaterWarning(false), 4000);
      } else {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          navigate('/leaderboard');
        }, 2000);
      }
      setIsSubmitting(false);
    }, 2000);
  };

  const isFormValid = formData.playerName && formData.srn && formData.game && formData.score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(123,63,228,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,79,216,0.3) 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({length: 15}, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00E5FF] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
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

        {/* Main form panel */}
        <motion.div 
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div 
            className="bg-[#151A3F] rounded-2xl p-8 border-2 border-[#7B3FE4] relative overflow-hidden"
            style={{
              boxShadow: `
                0 0 40px rgba(123,63,228,0.7),
                inset 0 0 40px rgba(123,63,228,0.1)
              `
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-2xl opacity-60" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-2xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-2xl opacity-60" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#00E5FF] rounded-br-2xl opacity-60" />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] mb-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                SUBMIT SCORE
              </h1>
              <p className="text-[#00E5FF] flex items-center justify-center space-x-2">
                <Gamepad2 className="w-5 h-5" />
                <span>Enter your arcade achievement</span>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Player Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#00E5FF]" />
                  <span>Player Name</span>
                </label>
                <input
                  type="text"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  placeholder="Enter your gaming alias"
                  required
                />
              </motion.div>

              {/* SRN */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-[#00E5FF]" />
                  <span>SRN</span>
                </label>
                <input
                  type="text"
                  name="srn"
                  value={formData.srn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors font-mono"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  placeholder="PES1234"
                  required
                />
              </motion.div>

              {/* Game Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Gamepad2 className="w-4 h-4 text-[#00E5FF]" />
                  <span>Game</span>
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] focus:border-[#FF4FD8] focus:outline-none transition-colors cursor-pointer"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  required
                >
                  <option value="">Select a game</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id} className="bg-[#0B0F2F]">
                      {game.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Score */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-[#E6E8FF] text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-[#00E5FF]" />
                  <span>Score</span>
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0B0F2F] border-2 border-[#7B3FE4]/50 rounded-lg text-[#E6E8FF] placeholder-[#E6E8FF]/50 focus:border-[#FF4FD8] focus:outline-none transition-colors text-right font-mono text-xl"
                  style={{
                    boxShadow: "inset 0 0 10px rgba(123,63,228,0.2)"
                  }}
                  placeholder="0"
                  min="0"
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg relative overflow-hidden transition-all ${
                    isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{
                    boxShadow: isFormValid && !isSubmitting ? "0 0 30px rgba(123,63,228,0.7)" : "none"
                  }}
                  whileHover={isFormValid && !isSubmitting ? { 
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(123,63,228,0.9)"
                  } : {}}
                  whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
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
                        <span>Submitting...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        className="flex items-center justify-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Send className="w-5 h-5" />
                        <span>SUBMIT SCORE</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Button glow effect */}
                  {isFormValid && !isSubmitting && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Scanline effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B3FE4] to-transparent opacity-5 h-1"
              animate={{ y: [0, 300, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Cheater Warning Modal */}
      <AnimatePresence>
        {showCheaterWarning && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ 
                scale: 1, 
                rotateY: 0,
              }}
              exit={{ scale: 0.5, rotateY: 180 }}
              style={{
                boxShadow: "0 0 50px rgba(239,68,68,0.8)"
              }}
            >
              {/* Glitch effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-50"
                animate={{
                  x: [-100, 100, -100],
                  skewX: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-red-100 mb-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(239,68,68,0.8)",
                      "0 0 20px rgba(239,68,68,1)", 
                      "0 0 10px rgba(239,68,68,0.8)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚠️ CHEATER DETECTED
                </motion.h2>
                
                <p className="text-red-200 mb-4">
                  Suspicious score detected. Please submit a legitimate score.
                </p>
                
                <motion.div 
                  className="text-xs text-red-300 font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  SECURITY BREACH • CODE: 0x404
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#151A3F] border-2 border-[#00E5FF] rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              style={{
                boxShadow: "0 0 50px rgba(0,229,255,0.8)"
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Trophy className="w-16 h-16 text-[#00E5FF] mx-auto mb-4" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-[#E6E8FF] mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                SCORE SUBMITTED!
              </h2>
              
              <p className="text-[#00E5FF]">
                Redirecting to leaderboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitScore;