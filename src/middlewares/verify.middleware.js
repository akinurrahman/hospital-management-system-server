import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies.Authorization?.split(" ")[1]; // "Authorization" cookie with "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if the decoded user has the 'admin' role
    const user = await User.findById(decoded._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    // Attach user information to the request for later use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyAdmin;
