import request from "supertest";
import express from "express";
import { User, sequelize } from "../../models/user.js";
import ProfileRoutes from "../../routes/profile.js";
import UserRoutes from "../../routes/user.js";
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

describe("POST /profile/delete-account", () => {
  it("should return 200 if the user successfully deletes their account", async () => {
    const deleteAccountResponse = await request(app)
      .post("/profile/delete-account")
      .type("form")
      .send({
        password: "test",
      });

    const user = await User.findOne({ where: { email: "test@email.com" } });

    expect(user).toBe(null);
    expect(deleteAccountResponse.status).toBe(200);
  });
  it("should return 400 if the user enters the wrong password", async () => {
    const deleteAccountResponse = await request(app)
      .post("/profile/delete-account")
      .type("form")
      .send({
        password: "NOT TEST",
      });

    const user = await User.findOne({ where: { email: "test@email.com" } });

    expect(user).toBe(null);
    expect(deleteAccountResponse.status).toBe(400);
  });
  it("should return 400 if the user does not enter a password", async () => {
    const deleteAccountResponse = await request(app)
      .post("/profile/delete-account")
      .type("form")
      .send({
        password: null,
      });

    expect(deleteAccountResponse.status).toBe(400);
  });
  it("should return 400 if the user is not currently logged in", async () => {
    // blank until session tokens are added
  });
  it("should return 400 if the password does not match the currently logged in user", async () => {
    // blank until session tokens are added
  });
});
