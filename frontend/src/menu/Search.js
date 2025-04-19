import React, { useRef } from 'react';

function Search() {
  const inputRef = useRef(null);

  const performSearch = () => {
    const query = inputRef.current.value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
      const title = card.querySelector('.game-title').textContent.toLowerCase();
      const description = card.querySelector('.game-description').textContent.toLowerCase();

      card.style.display =
        title.includes(query) || description.includes(query)
          ? ''
          : 'none';
    });
  };

  // Якщо клікнули в рядок — кидаємо на головну
  const handleInputClick = () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

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
          onClick={handleInputClick}      
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              performSearch();
            }
          }}
        />
        <button type="submit">
          <img
            src="/page/free-icon-loupe-751463.png"
            alt="Search Icon"
            width="20"
            height="20"
          />
        </button>
      </form>
    </div>
  );
}

export default Search;
