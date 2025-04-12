import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersList.css';

const UsersList = ({ onSelectUser, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        console.log('Users received:', response.data);
        const filteredUsers = response.data.filter((user) => user._id !== currentUserId);
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError('Не вдалося завантажити список користувачів');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUserId, API_URL]);

  return (
    <div className="users-page">
      <h1 className="users-title">Користувачі</h1>
      {isLoading ? (
        <p className="users-loading">Завантаження...</p>
      ) : error ? (
        <p className="users-error">{error}</p>
      ) : users.length === 0 ? (
        <p className="users-empty">Немає інших користувачів</p>
      ) : (
        <ul className="users-list">
          {users.map((user) => (
            <li key={user._id} className="user-row">
              <button
                onClick={() => onSelectUser && onSelectUser(user)}
                className="user-button"
              >
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className="user-created">
                    {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;
