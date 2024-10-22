import asynchandler from "express-async-handler";
import wc from "../config/woocommerce.js";
import {
  filterProductsData,
  filterProductData,
  filterTagData,
  getTagIdByName,
} from "../utils/utils.js";

// @desc    Get products
// @route   GET /api/products
// @access  Public
// @role    User
export const getProducts = asynchandler(async (req, res) => {
  const { search, per_page, page, category, min_price, max_price } = req.query;

  let query = {};
  Object.assign(query, {
    search: search || "",
    per_page: per_page || 10,
    page: page || 1,
    category: category || null,
    min_price: min_price || null,
    max_price: max_price || null,
  });

  try {
    const response = await wc.get("products", query);
    res.status(200).json(filterProductsData(response.data));
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
// @role    User
export const getProduct = asynchandler(async (req, res) => {
  try {
    const response = await wc.get(`products/${req.params.id}`);
    res.status(200).json(filterProductData(response.data));
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get new collection products
// @route   GET /api/products/new-collection
// @access  Public
// @role    User
export const getNewCol = asynchandler(async (req, res) => {
  try {
    const tagsResponse = await wc.get("products/tags");
    const newTagId = getTagIdByName(tagsResponse.data, "new");

    if (newTagId) {
      const response = await wc.get("products", { tag: newTagId });
      res.status(200).json(filterProductsData(response.data));
    } else {
      res.status(404).json({ message: "New tag not found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
// @role    User
export const getTrending = asynchandler(async (req, res) => {
  try {
    const tagsResponse = await wc.get("products/tags");
    const trendingTagId = getTagIdByName(tagsResponse.data, "trending");

    if (trendingTagId) {
      const response = await wc.get("products", { tag: trendingTagId });
      res.status(200).json(filterProductsData(response.data));
    } else {
      res.status(404).json({ message: "Trending tag not found" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Get product tags
// @route   GET /api/products/tags
// @access  Public
// @role    User
export const getTags = asynchandler(async (req, res) => {
  try {
    const response = await wc.get("products/tags");
    res.status(200).json(filterTagData(response.data));
  } catch (error) {
    throw new Error(error);
  }
});
