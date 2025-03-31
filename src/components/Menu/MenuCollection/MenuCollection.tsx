// MenuCollection.tsx
import MenuItem from "../MenuItems/MenuItem";

const MenuCollection = () => {
  return (
    <div className="container mx-auto grid grid-cols-4 grid-rows-2 gap-5 mt-11 max-w-4xl">
      <MenuItem ItemImage="usable_img/MenuImga1.png" ItemText="Закуски" ItemLinkTo="/Menu/zakuski" />
      <MenuItem ItemImage="usable_img/MenuImga2.png" ItemText="Десерты" ItemLinkTo="/Menu/deserty" className="row-span-2" />
      <MenuItem ItemImage="usable_img/MenuImga3.png" ItemText="Горячие блюда" ItemLinkTo="/Menu/goryachie-blyuda" className="row-span-2" />
      <MenuItem ItemImage="usable_img/MenuImga4.png" ItemText="Завтраки" ItemLinkTo="/Menu/zavtraki" />
      <MenuItem ItemImage="usable_img/MenuImga5.png" ItemText="Винная карта" ItemLinkTo="/Menu/vinnaya-karta" />
      <MenuItem ItemImage="usable_img/MenuImga6.png" ItemText="Барная карта" ItemLinkTo="/Menu/barnaya-karta" />
    </div>
  );
};

export default MenuCollection;
