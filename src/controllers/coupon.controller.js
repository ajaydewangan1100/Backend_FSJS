//
import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";

// method create coupon
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  if (!code && !discount) {
    throw new CustomError("Code and discount are required", 400);
  }

  // check if coupon code already exist
  const existCoupon = await Coupon.findOne(code);

  if (existCoupon) {
    throw new CustomError("Coupon already exist with this code", 400);
  }

  //   creating new coupon
  const coupon = await Coupon.create({
    code: code,
    discount: discount,
  });

  if (!coupon) {
    throw new CustomError("Error occured on coupon creation time", 500);
  }

  res.status(200).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

// method get one coupon
export const getCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne(code);

  if (!coupon) {
    throw new CustomError("No coupon found with this code", 400);
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// method get All coupon
export const getAllCoupon = asyncHandler(async (req, res) => {
  const allCoupons = await Coupon.find({});

  if (!allCoupons) {
    throw new CustomError("No coupons found", 400);
  }

  res.status(200).json({
    success: true,
    allCoupons,
  });
});

// method update coupon
export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  const coupon = await Coupon.findOneAndUpdate({ code, discount });

  if (!coupon) {
    throw new CustomError("Error occured on coupon updation", 400);
  }

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
});

// method delete coupon
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOneAndDelete(code);

  if (!coupon) {
    throw new CustomError("Error occured on coupon deletion", 500);
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
