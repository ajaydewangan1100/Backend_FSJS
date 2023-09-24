import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: [
        {
          productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          price: Number,
        },
      ],
      requiered: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requiered: true,
    },
    address: {
      type: String,
      requiered: true,
    },
    phoneNumber: {
      type: Number,
      requiered: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupon: String,
    transactionId: String,
    status: {
      type: String,
      enum: Object.values(orderStatus),
      DEFAULT: orderStatus.ORDERED,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
