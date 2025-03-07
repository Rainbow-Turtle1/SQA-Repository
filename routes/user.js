import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import validator from "validator";
import { NewSessionToken, ClearSessionToken } from "./session-tokens.js";
import {
  setCurrentLoggedInUser,
  getCurrentLoggedInUser,
} from "./shared-data.js";

const router = Router();

// Register Route
router.get("/register", (req, res) => {
  res.render("user-profile/register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = req.body;

    name = name.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (
      validator.isEmpty(name) ||
      validator.isEmpty(email) ||
      validator.isEmpty(password)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to register.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Your email is in an invalid format.",
      });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({
        success: false,
        message: "Your password must be at least 6 characters long.",
      });
    }

    if (!validator.equals(password, confirmPassword)) {
      return res.status(400).json({
        success: false,
        message: "Your passwords do not match. Please retry.",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Redirecting to login...",
        redirectUrl: "/login",
      });
    }

    // Hash password and store user
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    return res.status(200).json({
      success: true,
      message: "Registration successful. Please login with your new account", // changed this to redirect to login to ensure token is created and user is validated
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
});

// Login Route
router.get("/login", (req, res) => {
  res.render("user-profile/login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to log in.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Your email is in an invalid format.",
      });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "password"],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not registered. Please register first.",
        redirectUrl: "/register",
      });
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }
    NewSessionToken(req, user.id); // create and store session token
    const successfulUser = await User.findOne({ where: { email } });
    setCurrentLoggedInUser({ ...successfulUser.dataValues });
    console.log("User logged in:", getCurrentLoggedInUser());

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

router.get("/logout", (req, res) => {
  ClearSessionToken(req); // Now this fully clears session data
  res.redirect("/login"); // Redirect user to login page
});

export default router;
