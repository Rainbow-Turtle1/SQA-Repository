import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
const router = Router();
import { User } from "../models/user.js";
import { NewSessionToken, tokenIsValid } from "../routes/sessionTokens.js";

// Register
router.get("/register", (req, res) => {
  res.render("user-profile/register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to register.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Your passwords do not match. Please retry.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered. Redirecting to the login page...",
        redirectUrl: "/login",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const uuid = uuidv4();
    await User.create({ uuid, name, email, password: hash });

    return res.status(200).json({
      success: true,
      message: "Registration successful. Redirecting to the home page...",
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("user-profile/login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to log in!",
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not registered. Please register first.",
        redirectUrl: "/register",
      });
    }

    // Check password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // Successful login
    return res.status(200).json({
      success: true,
      message: "Login successful. Redirecting to the home page...",
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in.",
    });
  }
});

export default router;
