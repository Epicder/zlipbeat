import React, { useState } from 'react';
import './components-css/rating-stars.css'; // Asegúrate de que la ruta sea correcta

const RatingStars = ({ maxRating = 5 }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (index) => {
    setRating(index + 1); // +1 porque el índice es 0-based
  };

  return (
    <div className="rate-stars">
      {[...Array(maxRating)].map((_, index) => (
        <span
          key={index}
          className={`star ${index < rating ? 'filled' : ''}`}
          onClick={() => handleRating(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;