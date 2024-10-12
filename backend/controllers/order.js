import asynchandler from "express-async-handler";
import { sDatabase } from "../config/supabase.js";

// @desc    Place an order
// @route   POST /api/order/place-order
// @access  Private
// @role    User
export const placeOrder = asynchandler(async (req, res) => {
  const { products, deliveryInfo } = req.body;

  if (!products || !deliveryInfo) {
    res.status(400);
    throw new Error("Cannot place order without products and delivery info!");
  }

  if (!products.length) {
    res.status(400);
    throw new Error("Cart is empty!");
  }

  products.map((product) => {
    // TODO: modify product data and filter only required fields
    const { id, quantity, price } = product;
    if (!id || !quantity || !price) {
      res.status(400);
      throw new Error("Product information is not complete!");
    }
  });

  const { fullName, contactPhone, address, city, deliveryInstructions } =
    deliveryInfo;

  if (!fullName || !contactPhone || !address) {
    res.status(400);
    throw new Error("Delivery information is not complete!");
  }

  const { data, error } = await sDatabase
    .from("order")
    .insert({
      user_id: req.id,
      products: products.map((item) => {
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        };
      }),
      delivery_info: {
        fullName,
        contactPhone,
        address,
        city,
        deliveryInstructions,
      },
    })
    .select();

  if (error) {
    res.status(500);
    throw error;
  }

  res.status(200).json({ message: "Order placed successfully", data });
});

// @desc    Place a custom order
// @route   POST /api/order/place-custom-order
// @access  Private
// @role    User
export const placeCustomOrder = asynchandler(async (req, res) => {
  const { orderInfo } = req.body;
  console.log(orderInfo);

  if (!orderInfo) {
    res.status(400);
    throw new Error("Cannot place order without order information!");
  }

  const {
    productName,
    description,
    image,
    externalLink,
    additionalNotes,
    deliveryInfo,
  } = orderInfo;

  if (!productName || !externalLink || !deliveryInfo) {
    res.status(400);
    throw new Error("Order information is not complete!");
  }

  const { fullName, contactPhone, address, city, deliveryInstructions } =
    deliveryInfo;

  if (!fullName || !contactPhone || !address) {
    res.status(400);
    throw new Error("Delivery information is not complete!");
  }

  const { data, error } = await sDatabase
    .from("custom_order")
    .insert({
      user_id: req.id,
      p_name: productName,
      p_description: description,
      p_image_id: image,
      p_link: externalLink,
      p_notes: additionalNotes,
      delivery_info: {
        fullName,
        contactPhone,
        address,
        city,
        deliveryInstructions,
      },
    })
    .select();

  if (error) {
    res.status(500);
    throw error;
  }

  res.status(200).json({ message: "Custom order placed successfully", data });
});
