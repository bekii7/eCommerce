import asynchandler from "express-async-handler";
import wc from "../config/woocommerce.js";
import { filterCategoryData } from "../utils/utils.js";

// @desc    Get categories
// @route   GET /api/categories
// @access  Public
// @role    User
export const getCategories = asynchandler(async (req, res) => {
  try {
    const response = await wc.get("products/categories");
    res.status(200).json(filterCategoryData(response.data));
  } catch (error) {
    res.status(500).json(error);
  }
});
