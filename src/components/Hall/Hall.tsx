"use client";
import React, { useRef, useEffect, useState, MouseEvent } from "react";
import "./Hall.scss";
import BookingModal from "../Modal/BookingModal/BookingModal";

// Тип для данных стола
interface Table {
  id: number;
  name: string;
  x: number;
  y: number;
}

const tables: Table[] = [
  { id: 1, name: "А1", x: 100, y: 100 },
  { id: 2, name: "А2", x: 200, y: 150 },
  { id: 3, name: "Б1", x: 300, y: 200 },
  { id: 4, name: "Б2", x: 400, y: 250 },
];

interface HallModalProps {
  isOpen: boolean;
  onClose: () => void;
  setNotification: (message: string | null) => void;
}

const HallModal: React.FC<HallModalProps> = ({ isOpen, onClose, setNotification }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Не удалось получить контекст canvas!");
        return;
      }

      const img = new Image();
      img.src = "usable_img/restaurant_map.jpg"; // Добавляем / в начале пути
      img.onload = () => {
        console.log("Картинка успешно загружена!");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        tables.forEach((table) => {
          ctx.beginPath();
          ctx.arc(table.x, table.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = "red";
          ctx.fill();
          ctx.fillStyle = "black";
          ctx.font = "16px Arial";
          ctx.fillText(table.name, table.x - 10, table.y - 15);
        });
      };
      img.onerror = () => {
        console.error("Не удалось загрузить картинку зала по пути /usable_img/restaurant_map.jpg!");
      };
    }
  }, [isOpen]);

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const table = tables.find(
      (t) => Math.sqrt((t.x - x) ** 2 + (t.y - y) ** 2) < 15
    );
    if (table) {
      console.log(`Выбран столик: ${table.name}`);
      setSelectedTable(table);
    }
  };

  const handleClose = () => {
    setSelectedTable(null); // Сбрасываем выбранный столик
    onClose(); // Закрываем модалку
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={handleClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={handleClose}>
          Закрыть
        </button>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
        />
        {selectedTable && (
          <BookingModal
            isOpen={!!selectedTable}
            onClose={() => setSelectedTable(null)}
            table={selectedTable}
            setNotification={setNotification}
            onComplete={handleClose} // Передаём функцию закрытия HallModal
          />
        )}
      </div>
    </div>
  );
};

export default HallModal;