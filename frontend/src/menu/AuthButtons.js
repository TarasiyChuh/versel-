// src/components/AuthButtons.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="auth-buttons">
      {token ? (
        <button onClick={handleLogout} className="btn">
          Вийти
        </button>
      ) : (
        <>
          <Link to="/login" className="btn">
            Логін
          </Link>
          <Link to="/register" className="btn">
            Реєстрація
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
