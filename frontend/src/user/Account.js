import React, { useState, useEffect } from 'react';
import './Account.css'; // Стилі для сторінки профілю

const Account = () => {
  const [user, setUser] = useState(null);

  // Отримуємо дані користувача з LocalStorage при завантаженні компонентаві
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Перевіряємо чи є користувач
  if (!user) {
    return <div>Завантаження...</div>;
  }

  // Логіка для виходу з акаунту
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // Перенаправлення на сторінку логіну після виходу
  };

  return (
    <div className="account-container">
      <div className="profile-header">
        <h1>Мій профіль</h1>
        <div className="avatar-container">
          <img src="https://via.placeholder.com/100" alt="Avatar" className="avatar" />
        </div>
      </div>
      <div className="profile-info">
        <p><strong>Нікнейм:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Можеш додавати інші поля за потребою */}
      </div>

      <div className="user-stats">
        <h2>Статистика</h2>
        <p><strong>Грає в:</strong> 5 ігор</p>
        <p><strong>Загальний час гри:</strong> 15 годин</p>
        {/* Тут можна додавати статистику, яку хочеш відображати */}
      </div>

      <div className="action-buttons">
        <button className="edit-button">Редагувати профіль</button>
        <button onClick={handleLogout} className="logout-button">
          Вийти
        </button>
      </div>
    </div>
  );
};

export default Account;
