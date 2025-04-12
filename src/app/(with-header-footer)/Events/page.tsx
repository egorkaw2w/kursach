"use client"
// src/components/Events/Events.tsx
import { useState, useEffect } from "react";
import Event from "@components/Events/Event";
import { getEvents, EventDTO } from "src/services/EventService";

const Events = () => {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect сработал");
    const fetchEvents = async () => {
      try {
        console.log("Запрашиваем мероприятия...");
        const data = await getEvents();
        console.log("Мероприятия получены:", data);
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка:", err);
        setError("Не удалось загрузить мероприятия");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="Events container mx-auto mt-10">Загрузка...</div>;
  if (error) return <div className="Events container mx-auto mt-10">{error}</div>;

  return (
    <div className="Events container mx-auto mt-10">
      <h2 className="EventTitle my-10">Мероприятия</h2>
      <div className="EventCollectionList flex flex-col">
        {events.length === 0 ? (
          <p>Мероприятия отсутствуют</p>
        ) : (
          events.map((event) => (
            <Event
              key={event.id}
              eventTitle={event.title}
              eventDiscription={event.description}
              EventImg={event.imageUrl}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;