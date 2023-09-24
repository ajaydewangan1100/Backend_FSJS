//
import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import AsyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";
import asyncHandler from "../service/asyncHandler.js";
import couponSchema from "../models/coupon.schema.js";

// generating orderId of razorpay and
export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;

  if (!product || products.length === 0) {
    throw new CustomError("No product found", 400);
  }

  let totalAmount = 0;
  let discountAmount = 0;

  //   Do product calculation based on DB calls

  let productPriceCalc = Promise.all(
    products.map(async (product) => {
      const { productId, count } = product;
      const productFromDB = await Product.findById(productId);

      if (!productFromDB) {
        throw new CustomError("No product found", 400);
      }

      if (productFromDB.stock < count) {
        return res.status(400).json({
          error: "Product quantity not in stock",
        });
      }

      totalAmount += productFromDB.price * count;
    })
  );
  await productPriceCalc();

  //   TODO : check for coupon discount if applicable

  const coupon = await Coupon.find(couponCode);

  if (!coupon && !coupon.active) {
    throw new CustomError("Coupon is not available", 400);
  }

  discountAmount = coupon.discount;

  totalAmount -= discountAmount;

  const options = {
    amount: Math.round(totalAmount * 100), // converting in paisa -> totalAmount* 100
    currency: "INR",
    receiptNumber: `receipt_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(Options);

  if (!order) {
    throw new CustomError("Unable to generate order", 400);
  }

  res.status(200).json({
    success: true,
    message: "razorpay order id generated succesfully",
    order,
  });
});

// TODO: add order in DB and update product stock
export const generateOrder = asyncHandler(async (req, res) => {
  // get all the required things from req which are defined under schema
  const {
    transactionId,
    products,
    coupon,
    quantity,
    phoneNumber,
    address,
    amount,
  } = req.body;
});

// TODO: get only my orders
export const getMyOrders = asyncHandler(async (req, res) => {
  //
});

// TODO: get only my orders : ADMIN
export const getAllOrders = asyncHandler(async (req, res) => {
  //
});

// TODO: update order status : ADMIN
export const updateOrders = asyncHandler(async (req, res) => {
  //
});
