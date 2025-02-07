import dotenv from "dotenv";
dotenv.config();

import process from "process";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./models/index.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profile.js";
import favicon from "serve-favicon";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process?.env?.PORT || 3000;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Sets a favicon for the website
app.use(favicon(path.join(__dirname, "public", "resources", "favicon.ico")));

// Lets static files to be served from /public
app.use(
  express.static(path.join(__dirname, "public", "resources", "profile-images"))
);

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey", // Replace with a strong, environment-based secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
    },
  })
);
// Parse URL-encoded bodies (as sent by HTML forms)
// This middleware is needed to handle form submissions in our blog application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// This middleware allows us to serve our CSS file and any other static assets
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", blogRoutes);
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

export default app;
