// src/components/Modal/BookingModal/BookingModal.tsx
import React, { useState, MouseEvent } from "react";
import "./BookingModal.scss";
import BookingDay from "../BookingDay/BookingDay";
import BookingDuration from "../BookingDuration/BookingDuration";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5252/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: {
    id: number;
    name: string;
    x?: number;
    y?: number;
  };
  setNotification: (message: string | null) => void;
  onComplete: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  table,
  setNotification,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const userId = 1; // Временная заглушка для userId

  const handleSelectDateTime = (date: string, time: string) => {
    console.log("Date and time selected:", { date, time });
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(2);
  };

  const handleSelectDuration = (duration: string) => {
    console.log("Duration selected:", duration);
    // Отладка: выведем коды символов строки duration
    const charCodes = duration.split("").map((char) => char.charCodeAt(0));
    console.log("Duration char codes:", charCodes);
    setSelectedDuration(duration);
    setStep(3);
  };

  const handleBooking = async () => {
    console.log("Starting handleBooking with state:", {
      selectedDate,
      selectedTime,
      selectedDuration,
      userId,
      comment,
    });

    if (!selectedDate || !selectedTime || !selectedDuration || !userId) {
      const missingFields = [];
      if (!selectedDate) missingFields.push("selectedDate");
      if (!selectedTime) missingFields.push("selectedTime");
      if (!selectedDuration) missingFields.push("selectedDuration");
      if (!userId) missingFields.push("userId");
      console.log("Missing required fields:", missingFields);
      toast.error("Пожалуйста, авторизуйтесь и выберите все данные для бронирования");
      return;
    }

    try {
      const [day, month, year] = selectedDate.split(",")[0].split(".").map(Number);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const reservationTime = new Date(2000 + year, month - 1, day, hours, minutes);
      console.log("Parsed reservationTime:", reservationTime.toISOString());

      console.log("Selected duration:", selectedDuration);

      if (!selectedDuration || typeof selectedDuration !== "string") {
        console.log("Invalid selectedDuration:", selectedDuration);
        throw new Error("Длительность не выбрана или имеет некорректный формат");
      }

      // Нормализуем строку: заменяем все пробелы на обычные
      const normalizedDuration = selectedDuration.trim().replace(/\s+/g, " ");
      console.log("Normalized duration:", normalizedDuration);
      // Отладка: выведем коды символов нормализованной строки
      const charCodes = normalizedDuration.split("").map((char) => char.charCodeAt(0));
      console.log("Normalized duration char codes:", charCodes);

      let durationMinutes: number;
      switch (normalizedDuration) {
        case "30 мин":
          durationMinutes = 30;
          break;
        case "1 час":
          durationMinutes = 60;
          break;
        case "1.5 часа":
          durationMinutes = 90;
          break;
        case "2 часа":
          durationMinutes = 120;
          break;
        case "2.5 часа":
          durationMinutes = 150;
          break;
        case "3 часа":
          durationMinutes = 180;
          break;
        case "3.5 часа":
          durationMinutes = 210;
          break;
        case "4 часа":
          durationMinutes = 240;
          break;
        default:
          console.log("Invalid duration format:", normalizedDuration);
          throw new Error("Некорректный формат длительности");
      }

      console.log("Calculated durationMinutes:", durationMinutes);

      const requestData = {
        tableId: table.id,
        userId: userId,
        reservationTime: reservationTime.toISOString(),
        durationMinutes: durationMinutes,
        comment: comment || null,
      };

      console.log("Sending booking request:", requestData);

      const response = await axios.post(`${API_URL}/TableReservations`, requestData);

      console.log("Booking created:", response.data);
      setNotification(
        `Столик ${table.name} забронирован на ${selectedTime} ${selectedDate} на ${selectedDuration} ✔️`
      );
      setTimeout(() => setNotification(null), 3000);
      onClose();
      onComplete();
    } catch (err: any) {
      console.error("Error creating booking:", err);
      // Улучшаем обработку ошибок
      let errorMessage = "Неизвестная ошибка";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.General) {
          errorMessage = errors.General[0];
        } else if (errors.ReservationTime) {
          errorMessage = errors.ReservationTime[0];
        } else if (errors.TableId) {
          errorMessage = errors.TableId[0];
        } else if (errors.UserId) {
          errorMessage = errors.UserId[0];
        } else if (errors.DurationMinutes) {
          errorMessage = errors.DurationMinutes[0];
        } else {
          errorMessage = JSON.stringify(errors);
        }
      } else if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(`Не удалось создать бронирование: ${errorMessage}`);
      console.log("Full error response:", err.response?.data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e: MouseEvent) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={onClose}>
          Закрыть
        </button>
        {step === 1 && <BookingDay onSelectDateTime={handleSelectDateTime} tableId={table.id} />}
        {step === 2 && <BookingDuration onSelectDuration={handleSelectDuration} />}
        {step === 3 && (
          <div>
            <h2>Комментарий к бронированию</h2>
            <textarea
              placeholder="Комментарий..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="complete-btn" onClick={handleBooking}>
              Завершить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;