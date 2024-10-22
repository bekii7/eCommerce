import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  productsRouter,
  categoriesRouter,
  orderRouter,
  deliveryInfoRouter,
  cartRouter,
  testRouter,
  userRouter,
} from "./routes/route.js";

import { errorHandler } from "./middlewares/error.js";

dotenv.config({ path: [".env.local", ".env"] });

const port = process.env.PORT || 5000;
const app = express();

app.use(
  // cors({
  //   origin: "http://localhost:5173", // replace with your frontend's origin
  //   credentials: true,
  // })
  cors()
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/order", orderRouter);
app.use("/api/delivery-info", deliveryInfoRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/test", testRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
