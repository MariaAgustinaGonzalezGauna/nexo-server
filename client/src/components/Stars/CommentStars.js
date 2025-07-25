import React from "react";
import StarIcon from "../../assets/icons/starIcon";

export default function CommentStars({ rating, size = "small" }) {
  // Determinar tamaños basados en la prop size
  const getSizes = () => {
    switch (size) {
      case "small":
        return { starSize: "14px", gap: "2px" };
      case "medium":
        return { starSize: "16px", gap: "3px" };
      case "large":
        return { starSize: "18px", gap: "4px" };
      default:
        return { starSize: "14px", gap: "2px" };
    }
  };

  const sizes = getSizes();

  if (!rating || rating === 0) {
    return null; // No mostrar estrellas si no hay puntuación
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: sizes.gap,
      marginLeft: '8px'
    }}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <StarIcon
            key={index}
            width={sizes.starSize}
            height={sizes.starSize}
            fill={isFilled ? "#F8B133" : "#73738B"}
          />
        );
      })}
    </div>
  );
} 