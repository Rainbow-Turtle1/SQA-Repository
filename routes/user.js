import { Router } from "express";
const router = Router();
import { User } from "../models/user.js";
import { createRedirectResponse } from "./userUtil.js";

// Register
router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.send(createRedirectResponse("Sorry, but all fields are required to register a user! Redirecting to the registration page in 3 seconds...", "/register"));
      return;
    }

    if (password !== confirmPassword) {
      res.send(createRedirectResponse("The passwords you have entered do not match! Redirecting to the registration page in 3 seconds...", "/register"));
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.send(createRedirectResponse("This email is already registered, why not log in? Redirecting to the login page in 3 seconds...", "/login"));
      return;
    }

    await User.create({ name, email, password });
    res.redirect("/");
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).send("Error registering new user.");
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send(createRedirectResponse("Sorry, but all fields are required to login! Redirecting to the login page in 3 seconds...", "/login"));
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.send(createRedirectResponse("You are not registered. Redirecting to the registration page in 3 seconds...", "/register"));
      return;
    }

    // Check password
    if (user.password !== password) {
      res.send(createRedirectResponse("That was the wrong password, sorry! Redirecting to the login page in 3 seconds...", "/login"));
      return;
    }

    // Successful login
    res.redirect("/");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user.");
  }
});

export default router;
