import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./models/index.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
// Parse URL-encoded bodies (as sent by HTML forms)
// This middleware is needed to handle form submissions in our blog application
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// This middleware allows us to serve our CSS file and any other static assets
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", blogRoutes);
app.use("/", userRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

export default app;