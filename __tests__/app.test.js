import request from "supertest";
import { sequelize } from "../models";
import express from "express";
import blogRoutes from "../routes/blog.js";
import { BlogPost } from "../models/index.js";

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

    // Check for the main page elements
    expect(response.text).toContain("Blog with Express");
    expect(response.text).toContain("+ Create Post");
    expect(response.text).toContain("Post Stats");

    expect(response.text).toContain(
      '<a class="login-button light-blue-button" href="/login">Login</a>'
    );

    expect(response.text).toContain(
      '<a class="register-button light-blue-button" href="/register">Register</a>'
    );
  });
  it("should return the 404 page", async () => {
    const response = await request(app).get("/undefined-route");

    expect(response.status).toBe(404);
    expect(response.text).toContain("Error");
  });
});

describe("Blog Routes", () => {
  beforeAll(async () => {
    // Sync the database and create some test data
    await BlogPost.sync({ force: true });
    await BlogPost.bulkCreate([
      {
        title: "new",
        author: "new",
        content: "Content of new post",
        signature: "33333333-3333-3333-3333-333333333333",
        created_at: new Date("2023-01-02"),
      },
      {
        title: "old",
        author: "old",
        content: "Content of old post",
        signature: "33333333-3333-3333-3333-333333333333",
        created_at: new Date("2023-01-01"),
      },
    ]);
  });

  afterAll(async () => {
    // Clean up the database
    await BlogPost.destroy({ where: {}, truncate: true });
  });

  describe("GET /", () => {
    it("should return all posts sorted by created_at DESC by default", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.text).toContain("new by new");
      expect(response.text).toContain("old by old");
      expect(response.text.indexOf("new by new")).toBeLessThan(
        response.text.indexOf("old by old")
      );
    });

    it("should return posts sorted by created_at ASC", async () => {
      const response = await request(app).get("/?q=&sort=created_at%3Aasc");
      expect(response.status).toBe(200);
      expect(response.text).toContain("new by new");
      expect(response.text).toContain("old by old");
      expect(response.text.indexOf("old by old")).toBeLessThan(
        response.text.indexOf("new by new")
      );
    });

    it("should return all posts sorted by A-Z", async () => {
      const response = await request(app).get("/?q=&sort=title%3Aasc");
      expect(response.status).toBe(200);
      expect(response.text).toContain("new by new");
      expect(response.text).toContain("old by old");
      expect(response.text.indexOf("new by new")).toBeLessThan(
        response.text.indexOf("old by old")
      );
    });

    it("should return all posts sorted by Z-A", async () => {
      const response = await request(app).get("/?q=&sort=title%3Adesc");
      expect(response.status).toBe(200);
      expect(response.text).toContain("new by new");
      expect(response.text).toContain("old by old");
      expect(response.text.indexOf("old by old")).toBeLessThan(
        response.text.indexOf("new by new")
      );
    });

    it("should return posts matching the search query", async () => {
      const response = await request(app).get("/?q=old");
      expect(response.status).toBe(200);
      expect(response.text).toContain("old by old");
      expect(response.text).not.toContain("new by new");
    });

    it("should return posts matching the search query case-insensitive", async () => {
      const response = await request(app).get("/?q=NEW");
      expect(response.status).toBe(200);
      expect(response.text).toContain("new by new");
      expect(response.text).not.toContain("old by old");
    });

    it("should return all posts sorted by by created_at ASC and matching the search query", async () => {
      await BlogPost.bulkCreate([
        {
          title: "old2",
          author: "old",
          content: "Content of new post",
          signature: "33333333-3333-3333-3333-333333333333",
          created_at: new Date("2023-01-02"),
        },
        {
          title: "old3",
          author: "old",
          content: "Content of newer post",
          signature: "33333333-3333-3333-3333-333333333333",
          created_at: new Date("2023-01-03"),
        },
      ]);
      const response = await request(app).get("/?q=old&sort=created_at%3Aasc");

      expect(response.status).toBe(200);
      expect(response.text).toContain("old by old");
      expect(response.text).toContain("old2 by old");
      expect(response.text).toContain("old3 by old");
      expect(response.text.indexOf("old by old")).toBeLessThan(
        response.text.indexOf("old2 by old")
      );
      expect(response.text.indexOf("old by old")).toBeLessThan(
        response.text.indexOf("old3 by old")
      );
      expect(response.text.indexOf("old2 by old")).toBeLessThan(
        response.text.indexOf("old3 by old")
      );
    });

    it("should return all posts sorted by by created_at DESC and matching the search query", async () => {
      await BlogPost.bulkCreate([
        {
          title: "old2",
          author: "old",
          content: "Content of new post",
          signature: "33333333-3333-3333-3333-333333333333", // Mock UUID
          created_at: new Date("2023-01-02"),
        },
        {
          title: "old3",
          author: "old",
          content: "Content of newer post",
          signature: "33333333-3333-3333-3333-333333333333", // Mock UUID
          created_at: new Date("2023-01-03"),
        },
      ]);
      const response = await request(app).get("/?q=old&sort=created_at%3Adesc");

      expect(response.status).toBe(200);
      expect(response.text).toContain("old by old");
      expect(response.text).toContain("old2 by old");
      expect(response.text).toContain("old3 by old");
      expect(response.text.indexOf("old3 by old")).toBeLessThan(
        response.text.indexOf("old2 by old")
      );
      expect(response.text.indexOf("old3 by old")).toBeLessThan(
        response.text.indexOf("old by old")
      );
      expect(response.text.indexOf("old2 by old")).toBeLessThan(
        response.text.indexOf("old by old")
      );
    });

    it("should return a message when no posts match the search query", async () => {
      const response = await request(app).get("/?q=nonexistent");
      expect(response.status).toBe(200);
      expect(response.text).toContain("Sorry, no posts found.");
      expect(response.text).not.toContain("old by old");
      expect(response.text).not.toContain("new by new");
    });
  });

  it("should return 401 if user not logged in", async () => {
    const response = await request(app).get("/post/1");
    expect(response.status).toBe(401);
  });
});

describe("GET /stats when no posts are available", () => {
  beforeAll(async () => {
    // Clear the BlogPost table to ensure no posts are available
    await BlogPost.destroy({ where: {}, truncate: true });
  });

  it("should return 0 for all stats when there are no posts", async () => {
    const response = await request(app).get("/stats");

    // Check the response for the correct default values
    expect(response.status).toBe(200);
    expect(response.text).toContain("Average: 0.00 characters");
    expect(response.text).toContain("Median: 0.00 characters");
    expect(response.text).toContain("Maximum: 0.00 characters");
    expect(response.text).toContain("Minimum: 0.00 characters");
    expect(response.text).toContain(
      "Total length of all posts: 0.00 characters"
    );
  });
});
