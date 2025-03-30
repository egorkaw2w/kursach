import Header from "@components/header/Header";
import Footer from "@components/footer/footer";
import MenuCollection from "@components/Menu/MenuCollection/MenuCollection";

const Menu = () => {
  return <div className="Menu">
    <Header/>
    <MenuCollection/>
    <Footer/>
  </div>;
};

export default Menu;
