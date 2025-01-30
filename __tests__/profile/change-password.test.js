import request from "supertest";
import express from "express";
import { User } from "../../models/user.js";
import ProfileRoutes from "../../routes/profile.js";
import bcrypt from "bcryptjs";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", ProfileRoutes);

beforeAll(async () => {
  await User.destroy({ where: {} });

  await User.create({
    name: "test",
    email: "test@email.com",
    password: await bcrypt.hash("test", 10),
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
});
