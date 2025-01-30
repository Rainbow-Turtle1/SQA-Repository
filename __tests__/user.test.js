import express from "express";
import bcrypt from "bcryptjs";
import { sequelize, User } from "../models/user.js";
import UserRoutes from "../routes/user.js";
import jest from "jest-mock";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", UserRoutes);

// Database lifecycle hooks
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database
});

afterAll(async () => {
  await sequelize.close(); // Clean up connections
});

// Mock Request and Response objects
function mockRequest(body = {}) {
  return {
    body,
    session: {},
  };
}

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
}

// GET Routes
describe("GET /register", () => {
  it("should render the register page", async () => {
    const req = mockRequest();
    const res = mockResponse();

    // Manually call the route handler
    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.get)
      .route.stack[0].handle(req, res);

    expect(res.render).toHaveBeenCalledWith("user-profile/register", {
      title: "Register",
    });
  });
});

describe("GET /login", () => {
  it("should render the login page", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.get)
      .route.stack[0].handle(req, res);

    expect(res.render).toHaveBeenCalledWith("user-profile/login", {
      title: "Login",
    });
  });
});

// POST Routes
describe("POST /register happy cases", () => {
  it("should register a new user if inputs are valid", async () => {
    const req = mockRequest({
      name: "Isabella",
      email: "Isabella@email.com",
      password: "1234",
      confirmPassword: "1234",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.post)
      .route.stack[0].handle(req, res);
    const user = await User.findOne({
      where: { email: "Isabella@email.com" },
    });
    expect(user).not.toBeNull();
    expect(user.uuid).not.toBeNull();
    expect(await bcrypt.compare("1234", user.password)).toBe(true);
  });
});

describe("POST /register error cases", () => {
  it("should return an error if required fields are missing", async () => {
    const req = mockRequest({
      uuid: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const res = mockResponse();

    // Call the POST /register handler
    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required to register.",
    });
  });

  it("should return an error if passwords do not match", async () => {
    const req = mockRequest({
      name: "Isabella",
      email: "Isabella@email.com",
      password: "1234",
      confirmPassword: "5678",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Your passwords do not match. Please retry.",
    });
  });
});

describe("POST /login happy paths", () => {
  it("should log in a user if credentials are valid", async () => {
    const password = await bcrypt.hash("securepassword", 10);
    await User.create({
      uuid: "010101"
      name: "Isabella",
      email: "isabella@example.com",
      password,
    });

    const req = mockRequest({
      email: "isabella@example.com",
      password: "securepassword",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login successful. Redirecting to the home page...",
      redirectUrl: "/",
    });
  });
});

describe("POST /login error cases", () => {
  it("should return an error if fields are missing", async () => {
    const req = mockRequest({
      email: "",
      password: "",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required to log in!",
    });
  });

  it("should return an error if the user is not registered", async () => {
    const req = mockRequest({
      email: "unknown@example.com",
      password: "1234",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "You are not registered. Please register first.",
      redirectUrl: "/register",
      success: false,
    });
  });

  it("should return an error if the password is incorrect", async () => {
    const password = await bcrypt.hash("securepassword", 10);
    await User.create({
      name: "Isabella",
      email: "isabella@invalid.com",
      password,
    });

    const req = mockRequest({
      email: "isabella@invalid.com",
      password: "apples",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Incorrect password. Please try again.",
    });
  });

  it("should handle errors and send a 500 response if an exception occurs", async () => {
    const req = mockRequest({
      email: "error@example.com",
      password: "errorpassword",
    });
    const res = mockResponse();
    const spy = jest.spyOn(console, "error").mockImplementation(() => {}); // Mock error logging

    // Simulate an error by causing the database to fail (e.g., by using a non-existent model or other error)
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

    await UserRoutes.stack
      .find((r) => r.route.path === "/login" && r.route.methods.post)
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while logging in.",
    });
    expect(spy).toHaveBeenCalledWith(
      "Error logging in user:",
      expect.any(Error)
    );
    spy.mockRestore();
  });
});
