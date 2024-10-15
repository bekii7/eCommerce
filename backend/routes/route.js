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
import { getInfos, saveInfo } from "../controllers/deliveryInfo.js";
import { getCart, updateCart } from "../controllers/cart.js";
import { supabaseAdmin } from "../config/supabase.js";
import expressAsyncHandler from "express-async-handler";
import { deleteAccount, updateProfile } from "../controllers/user.js";

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

// USER ROUTER
export const userRouter = express.Router();
userRouter.use(authMiddleware);
userRouter.route("/update-profile").post(updateProfile);
userRouter.route("/delete-account").delete(deleteAccount);
// userRouter.route("/change-password").post();

// ORDER ROUTER
export const orderRouter = express.Router();
orderRouter.use(authMiddleware);
orderRouter.route("/place-order").post(placeOrder);
orderRouter.route("/place-custom-order").post(placeCustomOrder);

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

// TEST ROUTER
export const testRouter = express.Router();
testRouter.route("/").get(expressAsyncHandler(async (req, res) => {}));
