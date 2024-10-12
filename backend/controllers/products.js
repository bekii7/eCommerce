import asynchandler from "express-async-handler";
import wc from "../config/woocommerce.js";
import { filterProductsData, filterProductData } from "../utils/utils.js";

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

  wc.get("products", query)
    .then((response) => {
      res.status(200).json(filterProductsData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
// @role    User
export const getProduct = asynchandler(async (req, res) => {
  wc.get(`products/${req.params.id}`)
    .then((response) => {
      res.status(200).json(filterProductData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


// @desc    Get new collection products
// @route   GET /api/products/new-collection
// @access  Public
// @role    User
export const getNewCol = asynchandler(async (req, res) => {
  wc.get("products", { tag: "190" })
    .then((response) => {
      res.status(200).json(filterProductsData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
// @role    User
export const getTrending = asynchandler(async (req, res) => {
  wc.get("products", { tag: "191" })
    .then((response) => {
      res.status(200).json(filterProductsData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


// @desc    Get product tags
// @route   GET /api/products/tags
// @access  Public
// @role    User
export const getTags = asynchandler(async (req, res) => {
  wc.get("products/tags")
    .then((response) => {
      res.status(200).json(filterProductsData(response.data));
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
