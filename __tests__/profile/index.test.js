import request from "supertest";
import express from "express";
import ProfileRoutes from "../../routes/profile.js";
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
} from "../../routes/shared-data.js";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", ProfileRoutes);

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
