import jwt from "jsonwebtoken";
import User from "../models/users.js";

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

export default protect;