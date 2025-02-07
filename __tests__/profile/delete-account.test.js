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
    uuid: "35dcc9cf-7173-48a8-9e5c-e4c1b700bf2c",
    name: "test",
    email: "test@email.com",
    password: await bcrypt.hash("test", 10),
  });
});

beforeEach(async () => {
  setCurrentLoggedInUser({
    id: 1,
    uuid: "35dcc9cf-7173-48a8-9e5c-e4c1b700bf2c",
    name: "test",
    email: "test@email.com",
    password: "$2a$10$iWKkixNJOjBEIQqUxrbKN.UCpv40d/ELuVS8mPMNdxcZ/SWDVArGa",
    createdAt: "2025-02-04T12:22:31.718Z",
    updatedAt: "2025-02-04T12:22:31.718Z",
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
});
