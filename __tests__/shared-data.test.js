import request from "supertest";
import express from "express";
import { sequelize } from "../models/user.js";
import ProfileRoutes from "../routes/profile.js";
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
  profilePicturePaths,
} from "../routes/shared-data.js";

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
