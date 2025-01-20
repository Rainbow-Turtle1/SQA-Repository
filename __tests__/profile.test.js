import request from "supertest";
import express from "express";
import { sequelize } from "../models/user.js";
import ProfileRoutes from "../routes/profile.js";
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
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

describe("POST /profile/edit", () => {
  it("should return 400 if the user incorrectly enters their name & email", async () => {
    const response = await request(app)
      .post("/profile/edit")
      .type("form")
      .send({ name: "John Smith" });

    expect(response.status).toBe(400);
  });
});

// 90-91 is password changing
// 105-108 is editing the profile
// 148 is changing the profile picture
