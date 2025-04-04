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

  return (
    <div className="booking-duration">
      <h2>Выберите длительность брони</h2>
      <div className="duration-grid">
        {durations.map((duration) => (
          <button
            key={duration}
            className="duration-item"
            onClick={() => onSelectDuration(duration)}
          >
            {duration}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingDuration;