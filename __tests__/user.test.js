import request from "supertest";
import express from "express";
import { sequelize } from "../models/user.js";
import UserRoutes from "../routes/user.js";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", UserRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Routes", () => {
  test("GET /register should render the registration page", async () => {
    const response = await request(app).get("/register");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Register");
  });

  test("POST /register should register a new user", async () => {
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password",
      confirmPassword: "password",
    });
    expect(response.status).toBe(200);
  });

  test("GET /login should render the login page", async () => {
    const response = await request(app).get("/login");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Login");
  });

  test("POST /login should log the user in", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password",
    });
    expect(response.status).toBe(200);
  });
});
