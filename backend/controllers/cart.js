import asynchandler from "express-async-handler";
import { sDatabase } from "../config/supabase.js";

// @desc    Get items in cart
// @route   GET /api/cart/get-items
// @access  Private
// @role    User
export const getCart = asynchandler(async (req, res) => {
  const { data, error } = await sDatabase
    .from("cart_items")
    .select("*")
    .eq("user_id", req.id);

  if (error) {
    res.status(400);
    throw error;
  }

  return res
    .status(200)
    .json({ items: data[0].products, size: data[0].products.length });
});

// @desc    Update items in cart
// @route   POST /api/cart/update-items
// @access  Private
// @role    User
export const updateCart = asynchandler(async (req, res) => {
  const { items } = req.body;

  if (!items) {
    res.status(400);
    throw new Error("Items not provided");
  }

  items.map((item) => {
    // TODO: modify item data and filter only required fields
    const { id, quantity, price, name } = item;
    if (!id || !quantity || !price || !name) {
      res.status(400);
      throw new Error("Cart Items information is not complete!");
    }
  });

  const { data, error } = await sDatabase
    .from("cart_items")
    .upsert({
      user_id: req.id,
      products: items.map((item) => {
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        };
      }),
    })
    .select();

  if (error) {
    res.status(400);
    throw error;
  }

  return res
    .status(200)
    .json({ items: data[0].products, size: data[0].products.length });
});
