//

import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";
import User from "../models/user.schema.js";

import mailHelper from "../utils/mailHelper.js";

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
export const signUp = asyncHandler(async (req, res) => {
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

// method for getting profile - getProfile
export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new CustomError("User not found", 401);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// method for Forgot Password -
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Email not given", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  // validateBeforeSave: false - means it will not check all validation given under schema
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested by you, please ignore `;

  // now need to send email - (use try catch probably give error because of nodeMailer)
  try {
    const options = {};
    await mailHelper({
      email: user.email, // we got it from DB
      subject: "Password reset mail",
      message,
    });
  } catch (error) {
    // if something wrong we need make cleanup all the things which we set
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    // then res error
    throw new CustomError(error.message || "Email could not be sent", 500);
  }
});

// method for reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    throw new CustomError("Password does not match");
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError("Password reset token is invalid or expired", 400);
  }

  // updating user passwrod
  user.password = password;

  // now we need to reset again passwordToken and password expiry
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  // saving user with new credentials on DB
  await user.save();

  // optional things here
  const token = user.getJWTToken();
  res.cookie("token", token, cookieOptions);

  // sending responce
  res.status(200).json({
    succes: true,
    message: "Password reset successfully",
    user,
  });
});
