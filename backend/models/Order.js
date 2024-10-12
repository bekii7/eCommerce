import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    link: { type: String, required: true },
    userId: { type: String, required: true},
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
