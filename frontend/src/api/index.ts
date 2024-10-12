import { CustomOrder, DeliveryInfo } from "../types";
import { baseServerUrl } from "../config";
import { getToken } from "../hooks/useSupabase";
// import { toast } from "react-toastify";
import { cartItem } from "../contexts/CartContext";

export const getNewCollectionProducts = async () => {
  const response = await fetch(`${baseServerUrl}/api/products/new`);
  return response;
};

export const getTrendingProducts = async () => {
  const response = await fetch(`${baseServerUrl}/api/products/trending`);
  return response;
};

export const getProducts = async ({ query }: { query?: string }) => {
  const response = await fetch(`${baseServerUrl}/api/products/?${query}`);

  return response;
};

export const getCategories = async () => {
  const response = await fetch(`${baseServerUrl}/api/categories`);

  return response;
};

export const getProductDetails = async (id: string | number | undefined) => {
  const response = await fetch(`${baseServerUrl}/api/products/${id}`);
  return response;
};

export const getDeliveryInfo = async () => {
  const response = await fetch(`${baseServerUrl}/api/delivery-info/get-infos`, {
    headers: {
      authorization: getToken(),
    },
  });

  return response;
};

export const saveDeliveryInfo = async (
  deliveryInfo: DeliveryInfo,
  triggerRefresh?: () => void
) => {
  try {
    const response = await fetch(
      `${baseServerUrl}/api/delivery-info/save-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: getToken(),
        },
        body: JSON.stringify({ deliveryInfo }),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message);
    }

    // Trigger refetch after successful save
    if (triggerRefresh) triggerRefresh();
  } catch (error: any) {
    // toast.error(error.message);
  }
};

export const placeOrder = async ({
  body,
}: {
  body: { products: cartItem[]; deliveryInfo: DeliveryInfo };
}) => {
  const response = await fetch(`${baseServerUrl}/api/order/place-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: getToken(),
    },
    body: JSON.stringify(body),
  });

  return response;
};

export const placeCustomOrder = async ({
  body,
}: {
  body: { orderInfo: CustomOrder };
}) => {
  const response = await fetch(
    `${baseServerUrl}/api/order/place-custom-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getToken(),
      },
      body: JSON.stringify(body),
    }
  );

  return response;
};
