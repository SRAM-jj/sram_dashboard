import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // Stagger variants for form elements
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  } as const;

  return (
    <div className="login-page">
      {/* Active Animated Background Elements */}
      <div className="bg-animations">
        <motion.div 
          className="glow-sphere sphere-1"
          animate={{
            x: [0, 150, -100, 200, 0],
            y: [0, 200, -150, 100, 0],
            scale: [1, 1.4, 0.8, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="glow-sphere sphere-2"
          animate={{
            x: [0, -200, 150, -100, 0],
            y: [0, -100, 250, -150, 0],
            scale: [1, 0.7, 1.5, 0.9, 1],
            rotate: [0, -120, -240, -360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="glow-sphere sphere-3"
          animate={{
            x: [0, 250, -200, 100, 0],
            y: [0, -250, 150, -100, 0],
            scale: [1, 1.3, 0.7, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="glow-sphere sphere-4"
          style={{ 
            width: '600px', 
            height: '600px', 
            background: 'radial-gradient(circle, rgba(2, 214, 163, 0.15), transparent 70%)',
            top: '20%',
            left: '20%'
          }}
          animate={{
            x: [-100, 100, -100],
            y: [-100, 100, -100],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="login-container">
        <motion.div 
          className="login-box"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="logo" variants={itemVariants}>
            S.R<span className="highlight">A</span>M
          </motion.h1>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <motion.div className="input-group" variants={itemVariants}>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="username" 
                  className="input-field" 
                  required
                />
              </div>
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="password" 
                  className="input-field" 
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
            
            <motion.button 
              type="submit" 
              className="login-button"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(2, 214, 163, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '10px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogIn size={18} />
                <span>Login</span>
              </div>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
