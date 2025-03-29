import React from 'react';
import './components-css/login.css';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/login';
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Welcome to ZlipBeat</h1>
        <p>Rate and discover music from your Spotify playlists</p>
        <button onClick={handleLogin} className="login-button">
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login; 