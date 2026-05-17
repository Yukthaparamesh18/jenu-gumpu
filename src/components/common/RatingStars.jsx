import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, readOnly = true, onChange, size = 16 }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const currentRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        >
          <Star
            size={size}
            className={`${
              star <= currentRating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
