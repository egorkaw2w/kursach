import Link from "next/link";
import "./MenuItem.scss";

type MenuItemProps = {
  ItemText: string;
  ItemImage: string;
  ItemLinkTo: string; // Теперь обязательно
  className?: string;
};

const MenuItem = ({ ItemText, ItemImage, ItemLinkTo, className }: MenuItemProps) => {
  return (
    <Link
      href={ItemLinkTo}
      className={`Linka menuItem ${className}`}
      style={{ "--textOverlay": `"${ItemText}"` } as React.CSSProperties}
    >
      <img src={ItemImage} alt={ItemText} className="w-full h-full object-cover" />
    </Link>
  );
};

export default MenuItem;