import React, { useState } from 'react';
import './components-css/rating-stars.css'; // Asegúrate de que la ruta sea correcta

const RatingStars = ({ maxRating = 5, songId, songName, artistName, albumImage, userId }) => {
  const [rating, setRating] = useState(0);

  const handleRating = async (index) => {
    const newRating = index + 1;
    setRating(newRating);

    try {
      const response = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          songId,
          rating: newRating,
          songName,
          artistName,
          albumImage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save rating');
      }

      console.log('Rating saved successfully');
    } catch (error) {
      console.error('Error saving rating:', error);
      // Revert the rating state if saving failed
      setRating(rating);
    }
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