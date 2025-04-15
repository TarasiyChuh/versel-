import React from 'react';

const StarRating = ({ value, onChange, readOnly }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className="star"
          style={{
            color: star <= value ? 'gold' : 'gray',
          }}
          onClick={() => !readOnly && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;