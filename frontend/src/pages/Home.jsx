import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  // Animated stars background
  const stars = Array.from({length: 50}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  // Floating particles
  const particles = Array.from({length: 20}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F] relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Floating neon particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-[#FF4FD8] rounded-full opacity-30"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 4,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Retro grid floor effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(123,63,228,0.3) 25%, rgba(123,63,228,0.3) 26%, transparent 27%, transparent 74%, rgba(123,63,228,0.3) 75%, rgba(123,63,228,0.3) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(123,63,228,0.3) 25%, rgba(123,63,228,0.3) 26%, transparent 27%, transparent 74%, rgba(123,63,228,0.3) 75%, rgba(123,63,228,0.3) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main arcade panel */}
          <motion.div 
            className="relative bg-[#151A3F] rounded-2xl p-8 border-2 border-[#7B3FE4] overflow-hidden"
            style={{
              boxShadow: `
                0 0 30px rgba(123,63,228,0.7),
                inset 0 0 30px rgba(123,63,228,0.1)
              `
            }}
            animate={{
              boxShadow: [
                "0 0 30px rgba(123,63,228,0.7), inset 0 0 30px rgba(123,63,228,0.1)",
                "0 0 50px rgba(123,63,228,0.9), inset 0 0 30px rgba(123,63,228,0.2)",
                "0 0 30px rgba(123,63,228,0.7), inset 0 0 30px rgba(123,63,228,0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00E5FF] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00E5FF] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF] rounded-br-2xl" />

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Title */}
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]"
                style={{ fontFamily: 'Orbitron, monospace' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                DELTA TIME 3.0
              </motion.h1>
              
              {/* Subtitle badge */}
              <motion.div 
                className="inline-block bg-gradient-to-r from-[#FF4FD8] to-[#7B3FE4] text-white px-4 py-1 rounded-full text-sm font-semibold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Mini Arcade Event
              </motion.div>

              {/* Event details */}
              <motion.div 
                className="space-y-3 mb-8 text-[#E6E8FF]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-[#00E5FF] font-semibold">Venue:</span>
                  <span>400B</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-[#00E5FF] font-semibold">Date:</span>
                  <span>14th & 15th March</span>
                </div>
                <div className="text-center">
                  <span className="text-[#FF4FD8] italic">"Prizes await the skill."</span>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <motion.button 
                  className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] text-white font-bold py-3 px-6 rounded-lg relative overflow-hidden group"
                  style={{
                    boxShadow: "0 0 20px rgba(123,63,228,0.7)"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(123,63,228,0.9)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/leaderboard')}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Enter Leaderboard</span>
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                </motion.button>
                
                <motion.button 
                  className="w-full border-2 border-[#00E5FF] text-[#00E5FF] font-bold py-3 px-6 rounded-lg relative overflow-hidden group hover:bg-[#00E5FF] hover:text-[#0B0F2F] transition-colors"
                  style={{
                    boxShadow: "0 0 20px rgba(0,229,255,0.5)"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(0,229,255,0.7)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/submit-score')}
                >
                  Submit Score
                </motion.button>
              </motion.div>
            </div>

            {/* Scanline effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B3FE4] to-transparent opacity-10 h-1"
              animate={{ y: [0, 300, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;