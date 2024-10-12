import { MdEmail } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { FaCamera } from "react-icons/fa";
import SmallLink from "./ui/small-link";
import useCartContext from "../hooks/useCartContext";
import { Link } from "react-router-dom";

import { cn } from "../lib/utils";
import UserProfile from "./UserProfile";

const Cart = ({
  size,
  small,
  className,
  iconSize,
}: {
  size: number;
  small?: boolean;
  className?: string;
  iconSize?: number;
}) => {
  return (
    <Link to="/checkout" className="relative">
      <TiShoppingCart size={iconSize || (small ? 28 : 42)} />
      <span
        className={cn(
          "flex items-center p-2 justify-center font-bold text-center absolute text-white bg-red-600 rounded-full",
          small
            ? "text-[0.6rem] w-[1.25rem] h-[1.25rem] -top-1.5 -right-1.5"
            : "text-xs -top-1 -right-1 w-6 h-6",
          className
        )}
      >
        {size > 99 ? "99+" : size}
      </span>
    </Link>
  );
};

export const SideBar = () => {
  const { cartState } = useCartContext();

  return (
    <div className="bg-orange-default sticky top-4 ml-4 py-4 px-2 h-[calc(100vh-1.75rem)] w-16 rounded-lg flex flex-col items-center justify-between max-md:hidden">
      <div className="flex flex-col items-center gap-2">
        <UserProfile iconSize={42} />
        <Cart
          size={cartState.size}
          className={`${cartState.size == 0 && "hidden"}`}
        />
      </div>
      <div className="flex flex-col gap-4">
        <SmallLink>
          <FaCamera size={16} />
        </SmallLink>
        <SmallLink>
          <MdEmail size={16} />
        </SmallLink>
      </div>
    </div>
  );
};

export const SideBarMobile = () => {
  const { cartState } = useCartContext();

  return (
    <div className="px-2.5 py-1.5 rounded-full bg-orange-default h-fit md:hidden">
      <div className="flex items-center justify-center gap-2">
        <UserProfile iconSize={36} />
        <Cart
          size={cartState.size}
          className={`${cartState.size == 0 && "hidden"}`}
          small
          iconSize={36}
        />
      </div>
    </div>
  );
};
