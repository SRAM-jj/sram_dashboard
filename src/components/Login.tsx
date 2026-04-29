import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">
          S.R<span className="highlight">A</span>M
        </h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="username" 
            className="input-field" 
            required
          />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="password" 
            className="input-field" 
            required
          />
          
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="show-password" 
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="show-password">show password</label>
          </div>
          
          <button type="submit" className="login-button">
            login
          </button>
        </form>
      </div>
    </div>
  );
}
