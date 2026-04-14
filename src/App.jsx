import { useState } from 'react';
import './App.css';

function App() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">
          S.R<span className="highlight">A</span>M
        </h1>
        
        <form className="login-form">
          <input 
            type="text" 
            placeholder="username" 
            className="input-field" 
          />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="password" 
            className="input-field" 
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

export default App;