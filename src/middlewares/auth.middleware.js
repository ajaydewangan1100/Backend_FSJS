//
import User from "../models/user.schema.js";
import config from "../config/index.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";

// middleware for checking loggedin or not (using token of browser or token from headers if req not by browser)
export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  // under this condition we are checking browser cookies via - req.cookies.token
  // if req is not coming from browser - req.headers.authorization
  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not authorized to access this resource", 401);
  }

  // checking format if format of token is wrong or any other thing done with token - (usually when not getting token from browser)
  try {
    // verifying token by provided secret key - (verify() is given by JWT itself)(this will give an object)
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

    // if token verified - fetch user details via _id which is given by JWT.verify() and stored as object in decodedJwtPayload
    // here we are getting all the things from DB
    // const user = await User.findOne(decodedJwtPayload._id);

    // here we are mentioning what things we need of user from DB (remember this will only separated by space)
    const user = await User.findOne(decodedJwtPayload._id, "name email role");

    // we can add the user details with "req" - so next method or middlewares will get direct access of user data
    // below will add whole user things which we got by DB
    req.user = user;

    next();
  } catch (error) {
    throw new CustomError("Not authorized to access this resource", 401);
  }

  //   necessary next() for middlewares
  next();
});

// this syntax is different because here we need to pass parameter also
// this method only we can use after isLoggedIn - because we need to use -> req.user.roles (which is added by isLoggedIn)
export const authorize = (...requiredRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!requiredRoles.includes(req.user.roles)) {
      throw new CustomError("Not authorized to access this resource", 402);
    }
    next();
  });
