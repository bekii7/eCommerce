import express from "express";

import { getCategories } from "../controllers/categories.js";
import {
  getNewCol,
  getProduct,
  getProducts,
  getTags,
  getTrending,
} from "../controllers/products.js";

import { authMiddleware } from "../middlewares/auth.js";
import { placeCustomOrder, placeOrder } from "../controllers/order.js";
import upload from "../middlewares/upload.js";
import { getInfos, saveInfo } from "../controllers/deliveryInfo.js";
import { getCart, updateCart } from "../controllers/cart.js";

// PRODUCT ROUTER
export const productsRouter = express.Router();
productsRouter.route("/").get(getProducts);
productsRouter.route("/new").get(getNewCol);
productsRouter.route("/tags").get(getTags);
productsRouter.route("/trending").get(getTrending);
productsRouter.route("/:id").get(getProduct);

// CATEGORY ROUTER
export const categoriesRouter = express.Router();
categoriesRouter.route("/").get(getCategories);

// AUTH ROUTER
export const authRouter = express.Router();
authRouter.route("/sign-up").get(() => {});
authRouter.route("/sign-in").get(() => {});
authRouter.route("/verify-email").get(() => {});
authRouter.route("/reset-password").get(() => {});

// ORDER ROUTER
export const orderRouter = express.Router();
orderRouter.use(authMiddleware);
orderRouter.route("/place-order").post(placeOrder);
orderRouter
  .route("/place-custom-order")
  .post(upload.single("pImage"), placeCustomOrder);

// DELIVERY INFO ROUTER
export const deliveryInfoRouter = express.Router();
deliveryInfoRouter.use(authMiddleware);
deliveryInfoRouter.route("/get-infos").get(getInfos);
deliveryInfoRouter.route("/save-info").post(saveInfo);

// CART ROUTER
export const cartRouter = express.Router();
cartRouter.use(authMiddleware);
cartRouter.route("/get-items").get(getCart);
cartRouter.route("/update-items").post(updateCart);
