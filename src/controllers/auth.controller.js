//
// Signup user

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/user.schema.js";

const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const signup = asyncHandler(async (req, res) => {
  // get data from user
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    // first method
    // res.status(400).json({
    //   success: false,
    //   message: "Requierd field",
    // });

    // second method
    // throw new Error('Requierd field')

    // third methoid via - CustomError (Own)
    throw new CustomError("Please add all fields", 400);
  }

  // Adding data to database
  //  1 - check if user already exist
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new CustomError("User already exist", 400);
  }

  // 2 - Here we will create user based on given data
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });

  // 3 - getting toen for that user
  const token = user.getJWTToken();

  // 4 - safety
  user.password = undefined;

  // before sending responce - store token to user's browser cookies
  res.cookie("token", token, cookieOptions);

  // responding to frontend
  res.status(200).json({
    success: true,
    token,
    user,
  });
});
