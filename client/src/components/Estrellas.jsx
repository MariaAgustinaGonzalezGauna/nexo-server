import React, { useState } from 'react';
const StarRating = ({ totalStars = 5, value = 0, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onRatingChange?.(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl cursor-pointer transition-colors"
          >
            <span className={starValue <= (hover || value) ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;