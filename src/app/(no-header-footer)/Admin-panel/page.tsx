import SideNavBar from "@components/SideNavBar/SideNavBar"
import "./Admin.scss"

const Admin = () =>{
    const navItems = [
    { icon: "/icons/home.png", name: "Главная", link: "" },
    { icon: "/icons/menu.png", name: "Меню", link: "" },
    { icon: "/icons/cart.png", name: "Корзина", link: "" },
    { icon: "/icons/about.png", name: "О нас", link: "" },
  ]
    return(
        <div className="Admimka">
            <SideNavBar navElement={navItems}/>
        </div>
    )
}

export default Admin