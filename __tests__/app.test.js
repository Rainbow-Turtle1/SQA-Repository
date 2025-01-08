import request from "supertest";
import { sequelize } from "../models";
import express from "express";
import blogRoutes from "../routes/blog.js";

const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use("/", blogRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const response = await request(app).get("/").timeout({ deadline: 2000 });

    expect(response.status).toBe(200);
  });
  it("should return the home page", async () => {
    const response = await request(app).get("/");

    expect(response.text).toContain("Blog with Express");
    expect(response.text).toContain("+ Create Post");
    expect(response.text).toContain("Post Stats");
    expect(response.text).toContain("Login");
    expect(response.text).toContain("Register");
    expect(response.text).toContain(
      '<img class="profile-icon" src="resources/profile-images/grey-profile-icon.png" alt="Profile Picture">'
    );
  });
});
