//
// Signup user

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/user.schema.js";

const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/

// signup method here -
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

// login method here -
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new CustomError("Please fill all details", 400);
  }

  // finding user under DB
  const user = await User.findOne({ email: email }).select("+password");

  // if user not found respond error
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  // if user found need to match password
  const isPasswordMatched = await user.comparePassword(password);

  // now 2 conditions could be there -
  // 1 - if password matched
  if (isPasswordMatched) {
    // generating token
    const token = user.getJWTToken();
    // flushing password
    user.password = undefined;
    // storing cookies on user browser with cookiesOptions
    res.cookie("token", token, cookieOptions);
    // if user is under mobile app then we can't store cookie on browser, we can responce with this data
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  // 2 - if password not matched
  throw new CustomError("Password is incorrect", 400);
});

// logout method here -
export const logout = asyncHandler(async (req, res) => {
  req.cookie("token", none, {
    expires: new Date.now(),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
