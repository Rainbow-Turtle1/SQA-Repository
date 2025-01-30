import request from "supertest";
import express from "express";
import { User, sequelize } from "../models/user.js";
import ProfileRoutes from "../routes/profile.js";
import UserRoutes from "../routes/user.js";
//import { NewSessionToken } from "../routes/session-tokens.js";
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
} from "../routes/shared-data.js";
import jest from "jest-mock";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", ProfileRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // creates a user
  const req = mockRequest({
    name: "test",
    email: "test@email.com",
    password: "test",
    confirmPassword: "test",
  });
  const res = mockResponse();

  await UserRoutes.stack
    .find((r) => r.route.path === "/register" && r.route.methods.post)
    .route.stack[0].handle(req, res);
});

afterAll(async () => {
  await sequelize.close();
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

describe("GET Profile Routes", () => {
  test("GET /profile should render the profile page", async () => {
    const response = await request(app).get("/profile");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Profile");
  });
  test("GET /profile/edit should render the profile edit page", async () => {
    const response = await request(app).get("/profile/edit");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Edit Profile");
  });
  test("GET /profile/change-password should render the change password page", async () => {
    const response = await request(app).get("/profile/change-password");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Change Password");
  });
  test("GET /profile/delete-account should render the delete account page", async () => {
    const response = await request(app).get("/profile/delete-account");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Delete Account");
  });
});

describe("POST /profile/change-password", () => {
  it("should return 400 if old & new passwords are the same", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "oldpassword",
        newPassword: "oldpassword",
        confirmPassword: "oldpassword",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if fields are missing", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "password123",
        newPassword: "",
        confirmPassword: "",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if new passwords do not match", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "password123",
        newPassword: "newpassword123",
        confirmPassword: "differentpassword123",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if a malformed response is sent", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        passwordJson: {
          oldPassword: "password123",
          newPassword: "newpassword123",
          confirmPassword: "differentpassword123",
        },
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 if the response is empty", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 200 if password is changed successfully", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "password123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

    expect(response.status).toBe(200);
  });
});

describe("POST /profile and test profile picture functionality", () => {
  it("should return 200 if the profile picture can be changed to the next image", async () => {
    setAccountProfilePicture(0);

    const currentProfilePicture = getAccountProfilePicture();
    const response = await request(app)
      .post("/profile")
      .type("form")
      .send({ action: "nextPicture" });
    const response2 = await request(app)
      .post("/profile")
      .type("form")
      .send({ action: "savePicture" });

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);

    let updatedProfilePicture = getAccountProfilePicture();
    expect(updatedProfilePicture).toBe(currentProfilePicture + 1);
  });
});

describe("POST /profile and test profile picture functionality", () => {
  it("should return 200 if the profile picture can be changed to the previous image", async () => {
    const currentProfilePicture = getAccountProfilePicture();

    const response = await request(app)
      .post("/profile")
      .type("form")
      .send({ action: "prevPicture" });
    const response2 = await request(app)
      .post("/profile")
      .type("form")
      .send({ action: "savePicture" });

    expect(response.status).toBe(200);
    expect(response2.status).toBe(200);

    let updatedProfilePicture = getAccountProfilePicture();
    expect(updatedProfilePicture).toBe(currentProfilePicture - 1);
  });
});

describe("POST /profile/delete-account", () => {
  beforeEach(async () => {
    // creates a user
    const req = mockRequest({
      name: "test",
      email: "test@email.com",
      password: "test",
      confirmPassword: "test",
    });
    const res = mockResponse();

    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.post)
      .route.stack[0].handle(req, res);
  });

  it("should return 200 if the user successfully deletes their account", async () => {
    const req = mockRequest({
      password: "test",
    });
    const res = mockResponse();

    // deletes the logged in user
    await ProfileRoutes.stack
      .find(
        (r) =>
          r.route.path === "/profile/delete-account" && r.route.methods.post
      )
      .route.stack[0].handle(req, res);

    const email = "test@email.com";
    const user = await User.findOne({ where: { email } });

    expect(user).toBeNull();
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 400 if the user does not enter a password", async () => {
    const req = mockRequest({
      password: null,
    });
    const res = mockResponse();

    await ProfileRoutes.stack
      .find(
        (r) =>
          r.route.path === "/profile/delete-account" && r.route.methods.post
      )
      .route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if the user is not currently logged in", async () => {
    // blank until session tokens are added
  });
  it("should return 400 if the password does not match the currently logged in user", async () => {
    // blank until session tokens are added
  });
});

// 90-91 is password changing
// 105-108 is editing the profile
// 148 is changing the profile picture

describe("POST /profile/edit and test edit details functionality", () => {
  it("should return 200 if the user can change both their name & email", async () => {
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({
        name: "Test Name",
        email: "test.name@email.com",
      });

    const user = await User.findOne({
      where: { email: "test.name@email.com" },
    });

    expect(user.name).toBe("Test Name");
    expect(user.email).toBe("test.name@email.com");
    expect(response.status).toBe(200);
  });
  it("should return 200 if the user can change only their name", async () => {
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({
        name: "Test Name",
      });

    const user = await User.findOne({
      where: { email: "test.name@email.com" },
    });

    expect(user.name).toBe("Test Name");
    expect(response.status).toBe(200);
  });
  it("should return 200 if the user can change only their email", async () => {
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({
        email: "test.name@email.com",
      });

    const user = await User.findOne({
      where: { email: "test.name@email.com" },
    });

    expect(user.email).toBe("test.name@email.com");
    expect(response.status).toBe(200);
  });
  it("should return 400 if the user doesn't input a new name or email", async () => {
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({});

    expect(response.status).toBe(400);
  });
  it("should return 400 if the user tries to change their email to one that already exists in the database", async () => {
    const req = mockRequest({
      name: "Test Water Bottle",
      email: "testing@email.com",
      password: "test",
      confirmPassword: "test",
    });
    const res = mockResponse();
    await UserRoutes.stack
      .find((r) => r.route.path === "/register" && r.route.methods.post)
      .route.stack[0].handle(req, res);
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({
        name: "Water Bottle",
        email: "testing@email.com",
      });
    expect(response.status).toBe(400);
  });
  it("should return 400 if the user tries to change their email to an invalid one", async () => {
    // requires session tokens to test
  });
});
