import React, { createContext, useReducer, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { fixLength, mergeCartItems } from "../utils";
import { FaMinusCircle } from "react-icons/fa";
import { toastUpdateConfig } from "../config";
import { useSupabase } from "../hooks/useSupabase";
import { getCartItems, updateCartItems } from "../api";

export interface cartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface cartState {
  items: cartItem[];
  size: number;
  sync?: boolean;
}

export const CartActions = {
  ADD_ITEM: "add_item",
  REMOVE_ITEM: "remove_item",
  CLEAR_CART: "clear_cart",
  SET_ITEMS: "set_items",
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
    case CartActions.SET_ITEMS: // New case to handle setting items from backend
      return {
        items: action.payload.items,
        size: action.payload.items.reduce((acc: number, item: cartItem) => {
          return acc + item.quantity;
        }, 0),
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
  const response = await updateCartItems(cartState.items);

  if (!response.ok) {
    toast.error("Failed to sync cart with backend!");
  }
};

export const CartContext = createContext<{
  cartState: cartState;
  cartDispatch: React.Dispatch<any>;
  syncOnSignIn: () => Promise<void>;
  resetOnSignOut: () => void;
}>({
  cartState: { items: [], size: 0 },
  cartDispatch: () => {},
  syncOnSignIn: async () => {},
  resetOnSignOut: () => {},
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

  const { authenticated } = useSupabase();

  // Save cart state to localStorage on every state change
  useEffect(() => {
    saveCartToLocalStorage(cartState);

    // Call sync function if authenticated
    if (authenticated) syncCartWithBackend(cartState);
  }, [cartState]);

  const [syncError, setSyncError] = useState(false);
  const syncOnSignIn = async () => {
    // Sync cart with backend on sign in
    const toastId = toast.loading(
      <div className="text-white">Syncing cart...</div>
    );
    try {
      const response = await getCartItems();

      if (!response.ok) {
        throw new Error("Failed to sync cart with backend!");
      }

      const data = await response.json();
      console.log(data.items);

      if (cartState.size > 0) {
        cartDispatch({
          type: CartActions.SET_ITEMS,
          payload: { items: mergeCartItems(data.items, cartState.items) },
        });
      } else {
        cartDispatch({
          type: CartActions.SET_ITEMS,
          payload: { items: [...data.items] },
        });
      }
      toast.update(toastId, {
        render: "Cart Synced Successfully!",
        type: "success",
        ...toastUpdateConfig,
      });
    } catch (error) {
      setSyncError(true);
      toast.update(toastId, {
        render: "Failed to sync cart data! Sign in again to resync.",
        type: "error",
        ...toastUpdateConfig,
      });
    }
  };

  const resetOnSignOut = () => {
    if (!syncError) {
      cartDispatch({ type: CartActions.CLEAR_CART });
      secureLocalStorage.removeItem("cart");
      setSyncError(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartState,
        cartDispatch: toastDispatch,
        syncOnSignIn: async () => await syncOnSignIn(),
        resetOnSignOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
