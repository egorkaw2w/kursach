// src/components/HallModal/HallModal.tsx
"use client";
import React, { useRef, useEffect, useState, MouseEvent } from "react";
import "./Hall.scss";
import BookingModal from "../Modal/BookingModal/BookingModal";
import axios from "axios";

const API_URL = "http://localhost:5252/api";

interface Table {
  id: number;
  name: string;
  x?: number;
  y?: number;
}

interface HallModalProps {
  isOpen: boolean;
  onClose: () => void;
  setNotification: (message: string | null) => void;
}

const HallModal: React.FC<HallModalProps> = ({ isOpen, onClose, setNotification }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Захардкодим координаты для столов, используя имена из базы данных
  const tableCoordinates: { [key: string]: { x: number; y: number } } = {
    "A-1": { x: 100, y: 100 },
    "A-2": { x: 200, y: 150 },
    "B-1": { x: 300, y: 200 },
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/Tables`);
        console.log("Tables fetched:", response.data);
        const tablesWithCoordinates = response.data.map((table: Table) => ({
          ...table,
          x: tableCoordinates[table.name]?.x || 0,
          y: tableCoordinates[table.name]?.y || 0,
        }));
        setTables(tablesWithCoordinates);
      } catch (err: any) {
        console.error("Error fetching tables:", err);
        setError("Не удалось загрузить столы");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTables();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && canvasRef.current && !loading && !error) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Не удалось получить контекст canvas!");
        return;
      }

      const img = new Image();
      img.src = "/usable_img/restaurant_map.jpg";
      img.onload = () => {
        console.log("Картинка успешно загружена!");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        tables.forEach((table) => {
          if (table.x !== undefined && table.y !== undefined) {
            ctx.beginPath();
            ctx.arc(table.x, table.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText(table.name, table.x - 10, table.y - 15);
          }
        });
      };
      img.onerror = () => {
        console.error("Не удалось загрузить картинку зала по пути /usable_img/restaurant_map.jpg!");
      };
    }
  }, [isOpen, tables, loading, error]);

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const table = tables.find(
      (t) => t.x !== undefined && t.y !== undefined && Math.sqrt((t.x - x) ** 2 + (t.y - y) ** 2) < 15
    );
    if (table) {
      console.log(`Выбран столик: ${table.name}`);
      setSelectedTable(table);
    }
  };

  const handleClose = () => {
    setSelectedTable(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={handleClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-btn" onClick={handleClose}>
          Закрыть
        </button>
        {loading && <div>Загрузка...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onClick={handleCanvasClick}
          />
        )}
        {selectedTable && (
          <BookingModal
            isOpen={!!selectedTable}
            onClose={() => setSelectedTable(null)}
            table={selectedTable}
            setNotification={setNotification}
            onComplete={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default HallModal;