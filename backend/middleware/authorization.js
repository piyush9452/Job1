import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Admin from "../models/admin.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);
      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      console.log("Authorized user:", req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // if (!token) {
  //   res.status(401);
  //   throw new Error("Not authorized, no token");
  // }
};

export const protectAdmin = errorHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        res.status(401);
        throw new Error("Not authorized, admin not found");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;