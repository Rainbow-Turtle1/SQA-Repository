import request from "supertest";
import express from "express";
import { User } from "../../models/user.js";
import ProfileRoutes from "../../routes/profile.js";
import bcrypt from "bcryptjs";
import { setCurrentLoggedInUser } from "../../routes/shared-data.js";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", ProfileRoutes);

beforeAll(async () => {
  await User.destroy({ where: {} });

  await User.create({
    uuid: "f9c73c2b-8e92-476d-8972-5251ccff36a0",
    name: "test",
    email: "test@email.com",
    password: await bcrypt.hash("test", 10),
  });
});

beforeEach(async () => {
  setCurrentLoggedInUser({
    id: 1,
    uuid: "f9c73c2b-8e92-476d-8972-5251ccff36a0",
    name: "test",
    email: "test@email.com",
    password: "$2a$10$iWKkixNJOjBEIQqUxrbKN.UCpv40d/ELuVS8mPMNdxcZ/SWDVArGa",
    createdAt: "2025-02-04T12:22:31.718Z",
    updatedAt: "2025-02-04T12:22:31.718Z",
  });
});

describe("POST /profile/change-password", () => {
  it("should return 200 if password is changed successfully", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "test",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

    expect(response.status).toBe(200);
  });
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

  it("should return 400 if old password is incorrect", async () => {
    const response = await request(app)
      .post("/profile/change-password")
      .type("form")
      .send({
        oldPassword: "test1233",
        newPassword: "test246",
        confirmPassword: "test246",
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
      .send();

    expect(response.status).toBe(400);
  });
});
