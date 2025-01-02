import request from "supertest";
import express from "express";
import { sequelize } from "../models/user.js";
import ProfileRoutes from "../routes/profile.js";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", ProfileRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

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
  test("GET /profile/change-password should render the change password page", async () => {
    const response = await request(app).get("/profile/change-password");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Change Password");
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
