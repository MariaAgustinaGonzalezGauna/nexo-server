import React, { useState } from "react";
import StarIcon from "../../assets/icons/starIcon";

export default function StarRate() {
  const [rating, setRating] = useState(null);

  return (
    <>
      {[...Array(5)].map((_, index) => {
        const currentRate = index + 1;
        return (
          <label key={currentRate}>
            <input
              type="radio"
              name="rate"
              value={currentRate}
              onClick={() => setRating(currentRate)}
              style={{ display: "none" }} // opcional para ocultar el radio
            />
            <StarIcon
              width={"30px"}
              height={"30px"}
              fill={currentRate <= rating ? "#F8B133" : "#73738B"}
            />
          </label>
        );
      })}
    </>
  );
}
