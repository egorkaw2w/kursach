import Event from "@components/Events/Event";

const Events = () => {
  return (
    <div className="Events container mx-auto mt-10">
      <h2 className="EventTitle my-10">Мероприятия</h2>
      <div className="EventCollectionList flex flex-col">
        <Event
          eventTitle="Танцы!"
          eventDiscription="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam, fugit alias voluptatem mollitia facere id quas amet? Deleniti iure provident amet natus quia porro? Quibusdam saepe quos qui esse. Nemo!"
          EventImg="usable_img/EventsImage/EventTestImage.jpg"
        />
        <Event
          eventTitle="Танцы!"
          eventDiscription="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam, fugit alias voluptatem mollitia facere id quas amet? Deleniti iure provident amet natus quia porro? Quibusdam saepe quos qui esse. Nemo!"
          EventImg="usable_img/EventsImage/EventTestImage.jpg"
        />
      </div>
    </div>
  );
};

export default Events;