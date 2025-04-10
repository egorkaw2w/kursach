// MenuCollection.tsx
import MenuItem from "../MenuItems/MenuItem";
import MenuItemMobile from "../MenuItems/MenuItemMobile";
import "./MenuCollection.scss"

const MenuCollection = () => {
  return (
<div className="MenuCollection container mx-auto flex flex-col mt-10">
  <h2 className="MenuTitle self-start w-2/3 mx-auto">Меню</h2>
     <div className="MenuCollection-list">
       <div className="container mx-auto    grid-cols-4 grid-rows-2 gap-5 mt-11 max-w-4xl hidden md:grid">
       <MenuItem ItemImage="usable_img/MenuImga1.png" ItemText="Закуски" ItemLinkTo="/Menu/zakuski" />
       <MenuItem ItemImage="usable_img/MenuImga3.png" ItemText="Горячие блюда" ItemLinkTo="/Menu/goryachie-blyuda" className="row-span-2" />
       <MenuItem ItemImage="usable_img/MenuImga4.png" ItemText="Завтраки" ItemLinkTo="/Menu/zavtraki" className="row-span-2"/>
       <MenuItem ItemImage="usable_img/MenuImga5.png" ItemText="Винная карта" ItemLinkTo="/Menu/vinnaya-karta" />
       <MenuItem ItemImage="usable_img/MenuImga2.png" ItemText="Десерты" ItemLinkTo="/Menu/deserty"  />
       <MenuItem ItemImage="usable_img/MenuImga6.png" ItemText="Барная карта" ItemLinkTo="/Menu/barnaya-karta" />
       </div>
       <div className="container mx-auto md:hidden flex flex-col gap-5 mt-11 ">
         <MenuItemMobile ItemText="Закуски" ItemLinkTo="/Menu/zakuski"/>
         <MenuItemMobile ItemText="Десерты" ItemLinkTo="/Menu/deserty"/>
         <MenuItemMobile ItemText="Горячие блюда" ItemLinkTo="/Menu/goryachie-blyuda"/>
         <MenuItemMobile ItemText="Завтраки" ItemLinkTo="/Menu/zavtraki"/>
         <MenuItemMobile ItemText="Винная карта" ItemLinkTo="/Menu/vinnaya-karta"/>
         <MenuItemMobile ItemText="Барная карта" ItemLinkTo="/Menu/barnaya-karta"/>
       </div>
     </div>
</div>
  );
};

export default MenuCollection;
