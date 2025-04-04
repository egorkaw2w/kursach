import React, { useState } from "react";
import "./BookingDay.scss";

// Тип для забронированных слотов
interface BookingSlot {
  date: string;
  time: string;
}

interface BookingDayProps {
  onSelectDateTime: (date: string, time: string) => void;
}

const BookingDay: React.FC<BookingDayProps> = ({ onSelectDateTime }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Список дат и временных слотов
  const dates: string[] = ["02.04.25, Ср", "03.04.25, Чт", "04.04.25, Пт"];
  const timeSlots: string[] = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30"];

  // Тестовые данные о забронированных слотах (в будущем из БД)
  const bookedSlots: BookingSlot[] = [
    { date: "02.04.25, Ср", time: "8:00" },
    { date: "03.04.25, Чт", time: "9:30" },
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Сбрасываем выбранное время при смене даты
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    setSelectedTime(time);
    onSelectDateTime(selectedDate, time); // Передаем дату и время в родительский компонент
  };

  // Проверяем, забронирован ли слот
  const isSlotBooked = (date: string, time: string): boolean => {
    return bookedSlots.some((slot) => slot.date === date && slot.time === time);
  };

  return (
    <div className="booking-day">
      <h2>Выберите дату и время</h2>
      <div className="datePickingArea">
        <div className="DatePicking">
          <button className="arrow" aria-label="Прокрутить вверх" />
          <div className="Calendar">
            {dates.map((date) => (
              <button
                key={date}
                className={`Calendar__item ${selectedDate === date ? "selected" : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                {date}
              </button>
            ))}
          </div>
          <button className="arrow-reverse" aria-label="Прокрутить вниз" />
        </div>
        {selectedDate && (
          <div className="TimePicking">
            {timeSlots.map((time) => {
              const isBooked = isSlotBooked(selectedDate, time);
              return (
                <button
                  key={time}
                  className={`Time_item ${selectedTime === time ? "selected" : ""} ${
                    isBooked ? "booked" : ""
                  }`}
                  onClick={() => !isBooked && handleTimeSelect(time)}
                  disabled={isBooked}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDay;