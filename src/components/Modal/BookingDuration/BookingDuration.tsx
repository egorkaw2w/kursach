// src/components/BookingDuration/BookingDuration.tsx
import React from "react";
import "./BookingDuration.scss";

interface BookingDurationProps {
  onSelectDuration: (duration: string) => void;
}

const BookingDuration: React.FC<BookingDurationProps> = ({ onSelectDuration }) => {
  const durations: string[] = [
    "30 мин",
    "1 час",
    "1.5 часа",
    "2 часа",
    "2.5 часа",
    "3 часа",
    "3.5 часа",
    "4 часа",
  ];

  // Нормализуем строки при инициализации
  const normalizedDurations = durations.map((duration) => duration.trim().replace(/\s+/g, " "));
  // Отладка: выведем коды символов всех значений durations
  normalizedDurations.forEach((duration) => {
    const charCodes = duration.split("").map((char) => char.charCodeAt(0));
    console.log(`Duration "${duration}" char codes:`, charCodes);
  });

  return (
    <div className="booking-duration">
      <h2>Выберите длительность брони</h2>
      <div className="duration-grid">
        {normalizedDurations.map((duration) => (
          <button
            key={duration}
            className="duration-item"
            onClick={() => {
              console.log("Button clicked, duration:", duration);
              onSelectDuration(duration);
            }}
          >
            {duration}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingDuration;