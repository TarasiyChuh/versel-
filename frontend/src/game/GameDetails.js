import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaDownload, FaComment } from 'react-icons/fa';
import './GameDetails.css';

function GameDetails() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState('0.00');
  const [votes, setVotes] = useState(0);
  const [ratingError, setRatingError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  // Завантаження деталей гриі
  const fetchGame = async () => {
    try {
      const res = await fetch(`${API_URL}/api/games/${gameId}`);
      if (!res.ok) throw new Error('Не вдалося отримати деталі гри');
      const data = await res.json();
      setGame(data);
    } catch (e) {
      console.error('Помилка при отриманні деталей гри:', e);
    }
  };

  // Завантаження коментарів
  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments/${gameId}`);
      if (!res.ok) throw new Error('Не вдалося отримати коментарі');
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error('Помилка при отриманні коментарів:', e);
    }
  };

  // Завантаження рейтингу
  const fetchRating = async () => {
    try {
      const res = await fetch(`${API_URL}/api/games/${gameId}/rating`);
      if (!res.ok) throw new Error('Не вдалося отримати рейтинг');
      const data = await res.json();
      setAverageRating(data.averageRating);
      setVotes(data.votes);
    } catch (e) {
      console.error('Помилка отримання рейтингу:', e);
      setRatingError('Не вдалось завантажити рейтинг');
    }
  };

  useEffect(() => {
    fetchGame();
    fetchComments();
    fetchRating();
  }, [gameId]);

  // Встановлення рейтингу користувачем
  const handleRating = async (value) => {
    setUserRating(value);
    setRatingError('');
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored) {
      setRatingError('Спочатку увійдіть, будь ласка 😉');
      return;
    }
    const userId = stored.id || stored._id;
    try {
      const res = await fetch(`${API_URL}/api/games/${gameId}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rating: value }),
      });
      if (!res.ok) {
        const err = await res.json();
        setRatingError(err.message || 'Невідома помилка');
      } else {
        await fetchRating();
      }
    } catch (e) {
      console.error('Помилка при відправці рейтингу:', e);
      setRatingError('Помилка при відправці рейтингу');
    }
  };

  // Додавання коментаря
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored) {
      console.error('Користувач не авторизований!');
      return;
    }
    const userId = stored.id || stored._id;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText, userId, gameId }),
      });
      if (!res.ok) throw new Error(`Сервер відмовив: ${res.status}`);
      setCommentText('');
      await fetchComments();
    } catch (e) {
      console.error('Помилка при додаванні коментаря:', e);
    } finally {
      setLoading(false);
    }
  };

  // Додавання гри до бібліотеки
  const handleDownload = async () => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored) {
      alert('Будь ласка, увійдіть, щоб додати гру до бібліотеки.');
      return;
    }
    const userId = stored.id || stored._id;

    try {
      const res = await fetch(`${API_URL}/api/library/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameData: {
            gameId,
            title: game.title,
            photo: game.photo,
            link: game.link,
          },
        }),
      });
      if (res.ok) {
        alert('Гра додана до вашої бібліотеки!');
        window.open(game.link, '_blank');
      } else {
        alert('Не вдалося додати гру до бібліотеки.');
      }
    } catch (e) {
      console.error('Помилка при додаванні гри:', e);
      alert('Сталася помилка. Спробуйте пізніше.');
    }
  };

  if (!game) return <p className="gd-loading">Завантаження гри...</p>;

  const { title, description, genre, photo } = game;

  return (
    <main className="gd-main">
      <section className="gd-section">
        <div className="gd-info">
          <img className="gd-poster" src={photo} alt={`Зображення ${title}`} />
          <div className="gd-details">
            <h1>{title}</h1>
            <p className="gd-desc">{description}</p>
            <p className="gd-genre"><strong>Жанр:</strong> {genre}</p>
            <button className="gd-download-btn" onClick={handleDownload}>
              <FaDownload className="gd-icon" /> Завантажити
            </button>
          </div>
        </div>

        <div className="gd-rating">
          <h3>Рейтинг: {averageRating} ({votes})</h3>
          <div className="gd-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar
                key={n}
                className={`gd-star ${n <= userRating ? 'active' : ''}`}
                onClick={() => handleRating(n)}
              />
            ))}
          </div>
          {ratingError && <p className="gd-error">{ratingError}</p>}
        </div>

        <div className="gd-comments">
          <h2><FaComment /> Коментарі</h2>
          <form className="gd-comment-box" onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Напишіть коментар..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Додаємо...' : 'Додати'}
            </button>
          </form>
          <div className="gd-comment-list">
            {comments.map((c) => (
              <div className="gd-comment" key={c._id}>
                <p>
                  <strong>{c.userId?.username || 'Анонім'}</strong>: {c.comment}
                </p>
                <p className="gd-time">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default GameDetails;
