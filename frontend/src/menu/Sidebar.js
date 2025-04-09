import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaStar, FaGamepad, FaUsers, FaEnvelope } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Заголовок */}
      <div className="sidebar-header">
        <h3>Мій Сайт</h3>
      </div>

      {/* Основні посилання */}
      <Link to="/" className="sidebar-button">
        <FaHome className="sidebar-icon" />
        Головна
      </Link>
      <Link to="/account" className="sidebar-button">
        <FaUser className="sidebar-icon" />
        Акаунт
      </Link>
      <Link to="/top" className="sidebar-button">
        <FaStar className="sidebar-icon" />
        Рейтинг
      </Link>

      {/* Розділювач */}
      <div className="sidebar-divider"></div>

      {/* Додаткові посилання */}
      <Link to="/free-games" className="sidebar-button">
        <FaGamepad className="sidebar-icon" />
        Веб-ігри
      </Link>
      <Link to="/users" className="sidebar-button">
        <FaUsers className="sidebar-icon" />
        Користувачі
      </Link>

      {/* Нижня секція */}
      <div className="sidebar-footer">
        <Link to="/settings" className="sidebar-button">
          <FaEnvelope className="sidebar-icon" />
          Повідомлення
        </Link>
        <p className="sidebar-copy">© 2025</p>
      </div>
    </div>
  );
}

export default Sidebar;