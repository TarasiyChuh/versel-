import React, { useRef } from 'react';

function Search() {
  const inputRef = useRef(null);

  const performSearch = () => {
    const query = inputRef.current.value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
      const title = card.querySelector('.game-title').textContent.toLowerCase();
      const description = card.querySelector('.game-description').textContent.toLowerCase();

      if (title.includes(query) || description.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Відловлюємо Enter у формі
  const onSubmit = e => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={onSubmit}>
        <input
          type="text"
          id="search-input"
          ref={inputRef}
          placeholder="Пошук ігор..."
          // Додатково можна ще відловити Enter тут, але form + onSubmit вже це робить
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              performSearch();
            }
          }}
        />
        <button type="submit">
          <img src="/page/free-icon-loupe-751463.png" alt="Search Icon" width="20" height="20" />
        </button>
      </form>
    </div>
  );
}

export default Search;
