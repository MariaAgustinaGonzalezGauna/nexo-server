import React, { useState, useEffect } from "react";
import axios from "axios";
import StarIcon from "../../assets/icons/starIcon";
import data from "../../config/data";

export default function StarDisplay({ eventoId, showCount = true, size = "normal", ratingUpdate = 0 }) {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getSizes = () => {
    switch (size) {
      case "small":
        return { fontSize: "14px", starSize: "16px", countSize: "10px", gap: "4px" };
      case "medium-large":
        return { fontSize: "24px", starSize: "28px", countSize: "12px", gap: "6px" };
      case "large":
        return { fontSize: "32px", starSize: "36px", countSize: "14px", gap: "8px" };
      default:
        return { fontSize: "16px", starSize: "18px", countSize: "11px", gap: "6px" };
    }
  };

  const sizes = getSizes();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${data.url}/api/ratings/evento/${eventoId}/estadisticas`);
        const puntuacion = Number(response.data.puntuacionPromedio);
        const cantidad = Number(response.data.cantidadPuntuaciones);
        setRating(isNaN(puntuacion) ? 0 : puntuacion);
        setCount(isNaN(cantidad) ? 0 : cantidad);
      } catch (error) {
        console.error("Error al obtener puntuación del evento:", error);
        setRating(0);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventoId) {
      fetchRating();
    }
  }, [eventoId, ratingUpdate]);

  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: sizes.gap }}>
        <span style={{ fontSize: sizes.fontSize, fontWeight: "bold", color: "#666" }}>0.0</span>
        <StarIcon width={sizes.starSize} height={sizes.starSize} fill="#73738B" />
        {showCount && <span style={{ fontSize: sizes.countSize, color: "#666" }}>(0)</span>}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: sizes.gap }}>
      <span
        style={{
          fontSize: sizes.fontSize,
          fontWeight: "bold",
          color: rating > 0 ? "#F8B133" : isDarkMode ? "#ccc" : "#666",
        }}
      >
        {(rating ?? 0).toFixed(1)}
      </span>
      <StarIcon
        width={sizes.starSize}
        height={sizes.starSize}
        fill={rating > 0 ? "#F8B133" : "#73738B"}
      />
      {showCount && count > 0 && (
        <span style={{ fontSize: sizes.countSize, color: isDarkMode ? "#aaa" : "#666" }}>
          ({count})
        </span>
      )}
    </div>
  );
}
