import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const Profile = () => {
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Витягуємо свого юзера з localStorage
  const storedUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);
  // Підтримуємо і _id, і id
  const currentUserId = storedUser._id || storedUser.id;

  // Який саме userId юзаємо — з URL (чужий) чи свій
  const userId = routeUserId || currentUserId;

  useEffect(() => {
    // Якщо навіть після цього нема id — кидаємо на логін
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/auth/users/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Помилка при завантаженні профілю');
      }
    };

    const fetchLibrary = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/library/library/user/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setLibrary(data);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError('Помилка при завантаженні бібліотеки');
      }
    };

    Promise.all([fetchProfile(), fetchLibrary()])
      .then(() => setLoading(false));
  }, [userId, navigate]);

  const handleStartChat = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/chats/createOrGetChat',
        { user2: userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/chat/${data.chatId}`);
    } catch (err) {
      console.error('Error creating or getting chat:', err);
    }
  };

  if (loading) return <div className="profile-loading">Завантаження профілю...</div>;
  if (error)   return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-page-wrapper">
      {/* Інфо-картка */}
      <div className="profile-user-card">
        <div className="profile-avatar-circle">
          <span className="profile-avatar-initial">
            {profile.username[0].toUpperCase()}
          </span>
        </div>
        <h1 className="profile-username-text">{profile.username}</h1>
        <p className="profile-email-text">{profile.email}</p>
      </div>

      {/* Бібліотека */}
      <h2 className="profile-library-heading">Бібліотека ігор</h2>
      <div className="profile-games-grid">
        {library.length > 0 ? (
          library.map(game => (
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

      {/* Кнопка чату */}
      <button onClick={handleStartChat} className="profile-chat-btn">
        Розпочати чат
      </button>
    </div>
  );
};

export default Profile;
