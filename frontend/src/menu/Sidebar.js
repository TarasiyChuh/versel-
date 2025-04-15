import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaStar, FaGamepad, FaUsers, FaEnvelope, FaRobot } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Мій Сайт</h3>
      </div>

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

      <div className="sidebar-divider"></div>

      <Link to="/free-games" className="sidebar-button">
        <FaGamepad className="sidebar-icon" />
        Веб-ігри
      </Link>
      <Link to="/users" className="sidebar-button">
        <FaUsers className="sidebar-icon" />
        Користувачі
      </Link>
      <Link to="/gemini-chat" className="sidebar-button">
        <FaRobot className="sidebar-icon" />
        Чат з AI
      </Link>

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