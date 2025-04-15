import React from 'react';
import './FreeGames.css';
import { Link } from 'react-router-dom';

function FreeGames() {
  const games = [
    { id: 1, title: 'Die in the Dungeon', link: 'https://html-classic.itch.zone/html/7330268/Die in the Dungeon 1.6.2f [WEB]/index.html?v=1732313661', description: ' Спробуйте знайти найкращу комбінацію, щоб підкорити двоповерхове підземелля', imageUrl: '/images/Dungeon.png' },
    { id: 2, title: 'Before the Ash', link: 'https://html-classic.itch.zone/html/13231466/before_the_ash_1.1_html5/index.html', description: 'Перетворіть Помпеї на процвітаюче місто до виверження Везувію', imageUrl: 'images/Pompei.png' },
    { id: 3, title: 'Switchblade', link: 'https://html-classic.itch.zone/html/12670957/index.html', description: 'Летіть через перешкоди в цій складній грі.', imageUrl: '/images/nig.png' },
    { id: 4, title: 'Prinz Game', link: 'https://html-classic.itch.zone/html/11252461/index.html?v=1732313552', description: 'Досліджуйте світ принца у цій унікальній пригоді.', imageUrl: '/images/grak.png' },
    { id: 4, title: 'WE BECOME', link: 'https://html-classic.itch.zone/html/300364/index.html?v=1542781840', description: 'Гра про цикли новин, порочні цикли, нескінченні цикли.', imageUrl: '/images/webecome.png' },
    { id: 4, title: 'Sleep', link: 'https://html.itch.zone/html/13360787/index.html', description: 'Пора спати... але як заснути найглибшим сном? Давайте рахувати овець!', imageUrl: '/images/Sleep.png' },
    { id: 4, title: 'God Veins', link: 'https://html.itch.zone/html/13313470/GodVeins[HTML]/index.html', description: 'Керуйте своїми ресурсами та приймайте мудрі рішення, за для перемоги.', imageUrl: '/images/GodVeins.png' },
    { id: 4, title: 'Tidehold', link: 'https://html.itch.zone/html/13344321/index.html', description: 'Візьміть під контроль підводну колонію та стежте за таємничим сигналом до її джерела.', imageUrl: '/images/Tidehold.png' },
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