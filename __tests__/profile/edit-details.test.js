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
    await User.create({
      name: "Test Water Bottle",
      email: "testing@email.com",
      password: await bcrypt.hash("test", 10),
    });

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
