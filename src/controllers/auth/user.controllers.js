import jwt from "jsonwebtoken";
import { User } from "../../models/user.models.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    // create new user and save to db
    const newUser = new User({ fullName, email, password });

    // Generate an access token and refresh token
    const accessToken = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Send response with user details and tokens
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          fullName: newUser.fullName,
          email: newUser.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const loginUser = (req, res) => {};
export const refreshToken = (req, res) => {};
