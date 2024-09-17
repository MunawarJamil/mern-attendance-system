import jwt from "jsonwebtoken";
import { ErrorResponse } from "./errorHandler.js";
import { userModel } from "../models/user.model.js";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from the authorization header
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized, no token", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch the user linked to the token
    req.user = await userModel.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized, token failed", 401));
  }
};

export { protect };
