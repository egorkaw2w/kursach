import React, { useState, MouseEvent } from "react";
import "./BookingModal.scss";
import BookingDay from "../BookingDay/BookingDay";
import BookingDuration from "../BookingDuration/BookingDuration";


// Тип для пропсов модалки
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: {
    id: number;
    name: string;
    x: number;
    y: number;
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

  const handleSelectDateTime = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(2); // Переходим к выбору длительности
  };

  const handleSelectDuration = (duration: string) => {
    setSelectedDuration(duration);
    setStep(3); // Переходим к вводу комментария
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedDuration) return;
    setNotification(
      `Столик ${table.name} забронирован на ${selectedTime} ${selectedDate} на ${selectedDuration} ✔️`
    );
    setTimeout(() => setNotification(null), 3000);
    onClose();
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e: MouseEvent) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={onClose}>
          Закрыть
        </button>
        {step === 1 && <BookingDay onSelectDateTime={handleSelectDateTime} />}
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