import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles.css'

function GameLibrary() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  // Завантаження ігор з сервера
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/games`)
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching games:', error));
  }, []);
  
  // Обробка натискання на картку гри
  const handleCardClick = (gameId) => {
    const token = localStorage.getItem('token'); // Перевірка на наявність токену
    if (!token) {
      alert('Будь ласка, увійди або зареєструйся, щоб переглядати деталі гри!');
      navigate('/login'); // Якщо немає токену — перенаправляємо на логін
    } else {
      navigate(`/game-details/${gameId}`); // Якщо токен є — перенаправляємо на сторінку деталей гри
    }
  };

  return (
    <div className="game-library">
      {games.map((game) => (
        <div
          key={game._id}
          className="game-card"
          onClick={() => handleCardClick(game._id)}  // Передаємо gameId при кліку
          style={{ cursor: 'pointer' }}
        >
          <img src={game.photo} alt={game.title} />
          <div className="game-info">
            <h2 className="game-title">{game.title}</h2>
            <p className="game-description">{game.genre}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameLibrary;
