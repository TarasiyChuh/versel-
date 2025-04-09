import React from 'react';
import './styles.css'

function Game2() {
  return (
    <div className="game-details-container">
        <div className="game-page">
          <div className="content-container">
            <img className="game-image" src="page/S.T.A.L.K.E.R._2.jpg" alt="Опис зображення" />
          </div>
          <div className="game-info2">
            <h1>S.T.A.L.K.E.R. 2: Серце Чорнобиля</h1>
            <p>
              «S.T.A.L.K.E.R. 2: Серце Чорнобиля» (англ. S.T.A.L.K.E.R. 2: Heart of Chornobyl) — українська рольова відеогра в жанрі постапокаліптичного
              шутера від першої особи з елементами survival horror та immersive sim, що розробляється та видається компанією GSC Game World. Гра є четвертою
              в культовій серії ігор «S.T.A.L.K.E.R.»
            </p>
            <button className="download-button">Завантажити</button>
          </div>
        </div>

        <div className="game-page">
          <div className="game-info2">
            <h2>Системні вимоги:</h2>
            <div className="requirements">
              <div className="requirements-list">
                <h3>Мінімальні</h3>
                <ul>
                  <li><strong>Операційна система:</strong> Windows 10 64-bit</li>
                  <li><strong>Процесор:</strong> Intel Core i5-4460 або AMD FX-8350</li>
                  <li><strong>Графіка:</strong> NVIDIA GeForce GTX 960 або AMD Radeon R9 280</li>
                  <li><strong>Оперативна пам'ять:</strong> 8 GB RAM</li>
                  <li><strong>Вільне місце на диску:</strong> 50 GB</li>
                </ul>
              </div>
              <div className="requirements-list">
                <h3>Рекомендовані</h3>
                <ul>
                  <li><strong>Операційна система:</strong> Windows 10 64-bit</li>
                  <li><strong>Процесор:</strong> Intel Core i7-6700K або AMD Ryzen 5 1600</li>
                  <li><strong>Графіка:</strong> NVIDIA GeForce GTX 1060 або AMD Radeon RX 580</li>
                  <li><strong>Оперативна пам'ять:</strong> 16 GB RAM</li>
                  <li><strong>Вільне місце на диску:</strong> 50 GB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Game2;
