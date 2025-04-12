import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Базовый URL из .env
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Помилка логіну');
      } else {
        alert('Вхід успішний!');
        // Зберігаємо токен та дані користувача в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Перехід на головну сторінку після успішного входу
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Сталася помилка. Спробуйте ще раз.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Логін</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-container">
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label>Пароль:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <br />
        <button type="submit" className="submit-button">Увійти</button>
      </form>
    </div>
  );
}

export default Login;
