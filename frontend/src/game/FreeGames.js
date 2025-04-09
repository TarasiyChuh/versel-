import React from 'react';
import './FreeGames.css';
import { Link } from 'react-router-dom';

function FreeGames() {
  const games = [
    { id: 1, title: 'Tic Tac Toe', link: 'https://html-classic.itch.zone/html/12670957/index.html', description: 'Класична гра в хрестики-нулики для двох гравців.', imageUrl: '/images/taras.png' },
    { id: 2, title: 'Snake Game', link: 'https://html-classic.itch.zone/html/13231466/before_the_ash_1.1_html5/index.html', description: 'Керуйте змійкою та збирайте їжу, щоб вирости!', imageUrl: 'images/AtomicHeart.jpg' },
    { id: 3, title: 'Flappy Bird', link: 'https://html-classic.itch.zone/html/11266961/8/index.html', description: 'Летіть через перешкоди в цій складній грі.', imageUrl: '/images/nig.png' },
    { id: 4, title: 'Prinz Game', link: 'https://html-classic.itch.zone/html/11252461/index.html?v=1732313552', description: 'Досліджуйте світ принца у цій унікальній пригоді.', imageUrl: '/images/grak.png' },
    
  ];

  return (
    <div className="free-games-container">
      <h1 className="free-games-title">Зона Безкоштовних Ігор</h1>
      <div className="games-list">
        {games.map((game) =>
          game.link.startsWith('http') ? (
            <a
              key={game.id}
              href={game.link}
              target="_blank"
              rel="noopener noreferrer"
              className="free-game-card"
            >
              <img src={game.imageUrl} alt={game.title} className="game-image" />
              <div className="game-content">
                <h2 className="game-title">{game.title}</h2>
                <p className="game-description">{game.description}</p>
              </div>
            </a>
          ) : (
            <Link key={game.id} to={game.link} className="free-game-card">
              <img src={game.imageUrl} alt={game.title} className="game-image" />
              <div className="game-content">
                <h2 className="game-title">{game.title}</h2>
                <p className="game-description">{game.description}</p>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default FreeGames;