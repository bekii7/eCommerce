import React, { createContext, useReducer, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { fixLength } from "../utils";
import { FaMinusCircle } from "react-icons/fa";

export interface cartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface cartState {
  items: cartItem[];
  size: number;
}

export const CartActions = {
  ADD_ITEM: "add_item",
  REMOVE_ITEM: "remove_item",
  CLEAR_CART: "clear_cart",
};

const cartReducer = (cartState: cartState, action: any) => {
  let exists = false;

  cartState.items.forEach((item) => {
    if (item.id === action.payload?.id) {
      exists = true;
    }
  });

  switch (action.type) {
    case CartActions.ADD_ITEM:
      return exists
        ? {
            items: cartState.items.map((item) =>
              item.id === action.payload.id
                ? {
                    ...item,
                    quantity: item.quantity + (action.payload.quantity || 1),
                  }
                : item
            ),
            size: cartState.size + (action.payload.quantity || 1),
          }
        : {
            items: [
              ...cartState.items,
              {
                id: action.payload.id,
                name: action.payload.name,
                price: action.payload.price,
                quantity: action.payload.quantity,
                permalink: action.payload.link,
              },
            ],
            size: cartState.size + (action.payload.quantity || 1),
          };
    case CartActions.REMOVE_ITEM:
      if (exists && action.payload.quantity > 1) {
        return {
          items: cartState.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          size: cartState.size - 1,
        };
      }

      return {
        items: cartState.items.filter((item) => item.id !== action.payload.id),
        size: cartState.size - 1,
      };
    case CartActions.CLEAR_CART:
      return {
        items: [],
        size: 0,
      };
    default:
      return cartState;
  }
};

const saveCartToLocalStorage = (cartState: cartState) => {
  secureLocalStorage.setItem("cart", JSON.stringify(cartState));
};

const loadCartFromLocalStorage = (): cartState => {
  const cart = secureLocalStorage.getItem("cart");
  return cart ? JSON.parse(cart as string) : { items: [], size: 0 };
};

const syncCartWithBackend = async (cartState: cartState) => {
  // TODO: Add fetch/POST logic to sync with backend
  console.log("Syncing cart with backend:", cartState);
};

export const CartContext = createContext<{
  cartState: cartState;
  cartDispatch: React.Dispatch<any>;
}>({
  cartState: { items: [], size: 0 },
  cartDispatch: () => {},
});

// Helper function to trigger toasts based on action type
const handleToastsForAction = (action: any) => {
  switch (action.type) {
    case CartActions.ADD_ITEM:
      toast.success(`'${fixLength(action.payload.name, 18)}' added to cart!`);
      break;
    case CartActions.REMOVE_ITEM:
      toast.info(`'${fixLength(action.payload.name, 18)}' removed from cart!`, {
        icon: <FaMinusCircle size={24} />,
      });
      break;
    case CartActions.CLEAR_CART:
      if (action.from !== "placeOrder")
        toast.info("Cart cleared!", { icon: <FaMinusCircle size={24} /> });
      break;
    default:
      toast.error("Something went wrong!");
  }
};

// Custom dispatch wrapper to handle toast notifications
const useToastDispatch = (dispatch: React.Dispatch<any>) => {
  return (action: any) => {
    // Call the actual reducer dispatch
    dispatch(action);

    // Handle the toasts after dispatch
    handleToastsForAction(action);
  };
};

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartState, cartDispatch] = useReducer(
    cartReducer,
    loadCartFromLocalStorage()
  );

  const toastDispatch = useToastDispatch(cartDispatch);

  // Save cart state to localStorage on every state change
  useEffect(() => {
    saveCartToLocalStorage(cartState);

    // Call sync function if authenticated
    syncCartWithBackend(cartState);
  }, [cartState]);

  return (
    <CartContext.Provider value={{ cartState, cartDispatch: toastDispatch }}>
      {children}
    </CartContext.Provider>
  );
};
