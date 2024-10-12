import asynchandler from "express-async-handler";
import wc from "../config/woocommerce.js";
import { filterCategoryData } from "../utils/utils.js";

// @desc    Get categories
// @route   GET /api/categories
// @access  Public
// @role    User
export const getCategories = asynchandler(async (req, res) => {
  wc.get("products/categories")
    .then((response) => {
      res.status(200).json(filterCategoryData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
