// src/Components/SignInPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const predefinedUsers = [
  { username: 'awgFinserv', password: '2580' },
  { username: '987654', password: '0776' }
];

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = predefinedUsers.find(user => user.username === username && user.password === password);
    
    if (user) {
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginCard}>
        <h2 style={styles.header}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  loginCard: {
    backgroundColor: '#222',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '360px',
    maxWidth: '100%',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    margin: '0 0 20px',
    fontSize: '28px',
    color: '#f39c12',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#444',
    color: '#fff',
    fontSize: '14px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#f39c12',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#e67e22',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
  }
};
