import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(profileResponse.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Помилка при завантаженні профілю');
      }
    };

    const fetchLibrary = async () => {
      try {
        const libraryResponse = await axios.get(`http://localhost:5000/api/library/library/user/${userId}`);
        setLibrary(libraryResponse.data);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError('Помилка при завантаженні бібліотеки');
      }
    };

    Promise.all([fetchProfile(), fetchLibrary()]).then(() => setLoading(false));
  }, [userId]);

  const handleStartChat = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chats/createOrGetChat',
        { user2: userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const chatId = response.data.chatId;
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error creating or getting chat:', error);
    }
  };

  if (loading) return <div className="profile-loading">Завантаження профілю...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-page-wrapper">
      {/* Секція інформації користувача */}
      <div className="profile-user-card">
        <div className="profile-avatar-circle">
          {/* Тут можна додати аватар якщо він є в profile */}
          <span className="profile-avatar-initial">
            {profile.username[0].toUpperCase()}
          </span>
        </div>
        <h1 className="profile-username-text">{profile.username}</h1>
        <p className="profile-email-text">{profile.email}</p>
      </div>

      {/* Секція бібліотеки ігор */}
      <h2 className="profile-library-heading">Бібліотека ігор</h2>
      <div className="profile-games-grid">
        {library && library.length > 0 ? (
          library.map((game) => (
            <div className="profile-game-item" key={game._id}>
              <div className="profile-game-image-wrapper">
                <img 
                  src={game.photo} 
                  alt={game.title} 
                  className="profile-game-image-content" 
                />
                <div className="profile-game-overlay">
                  <span className="profile-game-rating-badge">{game.rating}</span>
                </div>
              </div>
              <div className="profile-game-details">
                <h3 className="profile-game-title-text">{game.title}</h3>
                <p className="profile-game-desc">{game.description}</p>
                <div className="profile-game-meta">
                  <span className="profile-game-genre-tag">{game.genre}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="profile-no-games-text">Ігор в бібліотеці немає.</p>
        )}
      </div>

      {/* Кнопка для чату */}
      <button onClick={handleStartChat} className="profile-chat-btn">
        Розпочати чат
      </button>
    </div>
  );
};

export default ProfilePage;