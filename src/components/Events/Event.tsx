// src/components/Events/Event.tsx
import "./Event.scss";

type EventProps = {
  eventTitle: string;
  eventDiscription: string;
  EventImg: string;
};

const Event = ({ eventTitle, eventDiscription, EventImg }: EventProps) => {
  return (
    <div className="Event-item grid grid-cols-2 w-full h-full">
      <div className="imgArea">
        <img src={EventImg} alt={eventTitle} />
      </div>
      <div className="InfoArea flex flex-col justify-between h-full">
        <div>
          <h3 className="title">{eventTitle}</h3>
          <p className="eventDiscription">{eventDiscription}</p>
        </div>
      </div>
    </div>
  );
};

export default Event;