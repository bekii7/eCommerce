import React, { createContext, useReducer, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { fixLength } from "../utils";
import { FaMinusCircle } from "react-icons/fa";
import { getToken, useSupabase } from "../hooks/useSupabase";
import { baseServerUrl } from "../config";

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
  SET_ITEMS: "set_items", // New action type to set items from backend
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

const syncCartWithBackend = async (
  cartState: cartState,
  authenticated?: boolean,
  token?: string
): Promise<cartState | undefined> => {
  // TODO: Add fetch/POST logic to sync with backend
  if (!authenticated || !token) return; // Do not sync if the user is not authenticated

  try {
    const response = await fetch(`${baseServerUrl}/api/cart/update-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ items: cartState.items }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync cart with backend");
    }

    const updatedCart = (await response.json()) as cartState;
    return updatedCart; // Returning updated cart for later use
  } catch (error) {
    console.error("Error syncing cart:", error);
    return undefined;
  }
};

export const CartContext = createContext<{
  cartState: cartState;
  cartDispatch: React.Dispatch<any>;
  syncCartOnSignIn: () => Promise<void>; // Function to sync cart on sign-in
  clearCartOnSignOut: () => void; // Function to clear cart on sign-out
}>({
  cartState: { items: [], size: 0 },
  cartDispatch: () => {},
  syncCartOnSignIn: async () => {}, // Default function
  clearCartOnSignOut: () => {}, // Default function
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
    case CartActions.CLEAR_CART && action.from !== "signOut":
      if (action.from !== "placeOrder")
        toast.info("Cart cleared!", { icon: <FaMinusCircle size={24} /> });
      break;

    case CartActions.SET_ITEMS: // New case to handle setting items from backend
      return {
        items: action.payload.items,
        size: action.payload.size,
      };
    default:
      toast.error("Something went wrong!");
  }
};

// Custom dispatch wrapper to handle toast notifications
const useDispatchWToast = (dispatch: React.Dispatch<any>) => {
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

  const dispatch = useDispatchWToast(cartDispatch);

  const { authenticated } = useSupabase();
  const token = getToken();

  const syncCartOnSignIn = async () => {
    if (token) {
      const updatedCart = await syncCartWithBackend(
        cartState,
        authenticated,
        token
      );

      if (updatedCart) {
        dispatch({
          type: CartActions.SET_ITEMS,
          payload: {
            items:
              cartState.items.length > 0
                ? [...updatedCart.items, ...cartState.items]
                : updatedCart.items,
            size: updatedCart.items.reduce(
              (acc: number, item: any) => acc + item.quantity,
              0
            ),
          },
        });
      }
    }
  };

  // Clear cart on sign-out
  const clearCartOnSignOut = () => {
    dispatch({ type: CartActions.CLEAR_CART, from: "signOut" });
    secureLocalStorage.removeItem("cart"); // Clear local storage
  };

  // Save cart state to localStorage on every state change
  useEffect(() => {
    saveCartToLocalStorage(cartState);

    // Call sync function if authenticated
    const sync = async () => {
      try {
        const updatedCart = await syncCartWithBackend(
          cartState,
          authenticated,
          token
        );

        if (updatedCart) {
          dispatch({
            type: CartActions.SET_ITEMS,
            payload: { items: updatedCart?.items, size: updatedCart?.size },
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (authenticated) sync();
  }, [cartState]);

  return (
    <CartContext.Provider
      value={{
        cartState,
        cartDispatch: dispatch,
        syncCartOnSignIn,
        clearCartOnSignOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
