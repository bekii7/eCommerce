import { TiShoppingCart } from "react-icons/ti";

import { fixLength } from "../utils";
import { useNavigate } from "react-router-dom";
import useCartContext from "../hooks/useCartContext";
import { CartActions } from "../contexts/CartContext";
import { cn } from "../lib/utils";

interface ProductCardProps {
  id: string;
  img: string;
  title: string;
  price: string;
  quantity: number;
  collection?: boolean;
  className?: string;
}

const ProductCard = ({
  img,
  title,
  price,
  collection,
  id,
  quantity,
  className,
}: ProductCardProps) => {
  const { cartDispatch } = useCartContext();
  const navigate = useNavigate();

  const addToCart = (
    id: string,
    name: string,
    price: string,
    quantity: number,
  ) => {
    cartDispatch({
      type: CartActions.ADD_ITEM,
      payload: {
        id: id,
        name: name,
        price: price,
        quantity: quantity,
      },
    });
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className={cn(
        "flex flex-col w-full h-full max-w-sm gap-2 overflow-hidden bg-white rounded-lg cursor-pointer shadow-card",
        className
      )}
    >
      <div className={`${collection ? "h-60 min-h-60" : "h-64 min-h-64"}`}>
        <img src={img} alt={title} className={`object-cover w-full h-full`} />
      </div>
      <div className="flex flex-col justify-between h-full p-4">
        <p className="text-lg font-light" title={title}>
          {fixLength(title, 48)}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-bold">$ {price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id.toString(), title, price, quantity);
            }}
            className="flex gap-1 px-3 py-2 text-sm text-white bg-orange-500 rounded-full hover:scale-110"
          >
            <TiShoppingCart size={20} />
            <span>add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
