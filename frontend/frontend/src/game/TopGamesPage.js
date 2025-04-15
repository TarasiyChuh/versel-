import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopGamesPage.css'; // Підключаємо CSS-файл

function TopGamesPage() {
  const [topGames, setTopGames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/games/top/all`);
        setTopGames(res.data);
      } catch (err) {
        console.error('Помилка при завантаженні топ ігор:', err);
        setError('Не вдалося завантажити топ ігри');
      }
    };
  
    fetchTopGames();
  }, []);
  
  if (error) return <div className="top-error">{error}</div>;

  return (
    <div className="top-games-page">
      <h1>Топ Ігор </h1>
      <div className="top-games-list">
        {topGames.map((game, index) => (
          <div key={game._id} className="top-game-card">
            <span className={`top-rank ${index < 3 ? 'top-rank-highlight' : ''}`}>{index + 1}</span>
            <img src={game.photo} alt={game.title} className="top-game-image" />
            <div className="top-game-info">
              <h3 className="top-game-title">{game.title}</h3>
              <p className="top-game-genre">{game.genre}</p>
            </div>
            <div className="top-game-rating">
              <span className="top-rating">⭐ {game.rating}</span>
              <span className="top-votes">({game.votes} голосів)</span>
            </div>
            {game.link && (
              <a href={game.link} target="_blank" rel="noreferrer" className="top-game-link">
                🔗 Грати
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopGamesPage;