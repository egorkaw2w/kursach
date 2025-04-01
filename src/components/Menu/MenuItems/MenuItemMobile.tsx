import Link from "next/link";
import "./MenuItem.scss";

type MenuItemMobileProps = {
  ItemText: string;
  ItemLinkTo: string;
  className?: string;
};

const MenuItemMobile = ({ ItemText, ItemLinkTo, className }:MenuItemMobileProps) => {
    return (
        <Link href={ItemLinkTo} className={`${className} MenuItemMobile`}>
            {ItemText}
        </Link>
    )
}
export default MenuItemMobile;