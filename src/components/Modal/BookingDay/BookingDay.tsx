// src/components/BookingDay/BookingDay.tsx
import React, { useState, useEffect } from "react";
import "./BookingDay.scss";
import axios from "axios";

const API_URL = "http://localhost:5252/api";

interface BookingSlot {
  date: string;
  time: string;
  durationMinutes: number;
}

interface BookingDayProps {
  onSelectDateTime: (date: string, time: string) => void;
  tableId: number;
}

const BookingDay: React.FC<BookingDayProps> = ({ onSelectDateTime, tableId }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookingSlot[]>([]);

  // Генерируем даты, начиная с текущей
  const generateDates = () => {
    const today = new Date(); // Сегодня: 2025-04-13
    const dates: string[] = [];
    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const dayOfWeek = daysOfWeek[date.getDay()];
      dates.push(`${day}.${month}.${year}, ${dayOfWeek}`);
    }

    return dates;
  };

  const dates: string[] = generateDates(); // Например: ["13.04.25, Вс", "14.04.25, Пн", "15.04.25, Вт"]
  const allTimeSlots: string[] = [
    "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
    "20:30", "21:00"
  ];

  // Фильтруем временные слоты, чтобы исключить прошедшее время
  const filterTimeSlots = (date: string) => {
    const today = new Date();
    const [day, month, year] = date.split(",")[0].split(".").map(Number);
    const selectedDateTime = new Date(2000 + year, month - 1, day);

    // Если выбранная дата — не сегодня, показываем все слоты
    if (
      selectedDateTime.getDate() !== today.getDate() ||
      selectedDateTime.getMonth() !== today.getMonth() ||
      selectedDateTime.getFullYear() !== today.getFullYear()
    ) {
      return allTimeSlots;
    }

    // Если сегодня, фильтруем слоты, которые в прошлом
    return allTimeSlots.filter((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(2000 + year, month - 1, day, hours, minutes);
      return slotTime > today;
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${API_URL}/TableReservations`);
        console.log("Reservations fetched:", response.data);
        const reservations = response.data
          .filter((res: any) => res.tableId === tableId)
          .map((res: any) => {
            const start = new Date(res.reservationTime);
            return {
              date: `${start.getDate().toString().padStart(2, "0")}.${(start.getMonth() + 1).toString().padStart(2, "0")}.${start.getFullYear() - 2000}, ${["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][start.getDay()]}`,
              time: `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`,
              durationMinutes: res.durationMinutes
            };
          });
        setBookedSlots(reservations);
      } catch (err: any) {
        console.error("Error fetching reservations:", err);
      }
    };

    fetchReservations();
  }, [tableId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    setSelectedTime(time);
    onSelectDateTime(selectedDate, time);
  };

  const isSlotBooked = (date: string, time: string): boolean => {
    return bookedSlots.some((slot) => {
      if (slot.date !== date) return false;

      const [slotHours, slotMinutes] = slot.time.split(":").map(Number);
      const [checkHours, checkMinutes] = time.split(":").map(Number);
      const [day, month, year] = date.split(",")[0].split(".").map(Number);

      const slotStart = new Date(2000 + year, month - 1, day, slotHours, slotMinutes);
      const slotEnd = new Date(slotStart.getTime() + slot.durationMinutes * 60 * 1000);
      const checkTime = new Date(2000 + year, month - 1, day, checkHours, checkMinutes);

      return checkTime >= slotStart && checkTime < slotEnd;
    });
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
            {filterTimeSlots(selectedDate).map((time) => {
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