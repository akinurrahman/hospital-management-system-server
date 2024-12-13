import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Generic role verification middleware
export const verifyRole = (role) => {
  return async (req, res, next) => {
    try {
      // Get the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1]; // "Authorization" cookie with "Bearer <token>"

      if (!token) {
        return res
          .status(401)
          .json({ message: "No token, authorization denied" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Find the user based on decoded ID
      const user = await User.findById(decoded._id);
      if (!user || user.role !== role) {
        return res
          .status(403)
          .json({ message: `Access denied, not a ${role}` });
      }

      // Attach user information to the request for later use
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(`Error verifying ${role}:`, error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  };
};

// Usage for verifying admin
export const verifyAdmin = verifyRole("admin");

// Usage for verifying doctor
export const verifyDoctor = verifyRole("doctor");
