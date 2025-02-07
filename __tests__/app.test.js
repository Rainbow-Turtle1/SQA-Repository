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

    expect(response.text).toContain("Blog with Express");
    expect(response.text).toContain("+ Create Post");
    expect(response.text).toContain("Post Stats");
    expect(response.text).toContain("Login");
    expect(response.text).toContain("Register");
    expect(response.text).toContain(
      '<img class="profile-icon" src="resources/profile-images/grey-profile-icon.png" alt="Profile Picture">'
    );
  });
  it("should return the 404 page", async () => {
    const response = await request(app).get("/undefined-route");

    expect(response.status).toBe(404);
    expect(response.text).toContain("Error");
  });
});

describe("GET Blog Routes", () => {
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

    it("should return the 404 page", async () => {
      const response = await request(app).get("/undefined-route");

      expect(response.status).toBe(404);
      expect(response.text).toContain("Error");
    });
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

  describe("GET /create", () => {
    it("should return 200 OK", async () => {
      const response = await request(app).get("/create");
      expect(response.status).toBe(200);
    });
    it("should return the create post page", async () => {
      const response = await request(app).get("/create");
      expect(response.text).toContain("Create Post");
      expect(response.text).toContain("Title");
      expect(response.text).toContain("Author");
      expect(response.text).toContain("Content");
      expect(response.text).toContain("Create Post");
    });
  });

  describe("GET /stats", () => {
    it("should return 200 OK", async () => {
      const response = await request(app).get("/stats");
      expect(response.status).toBe(200);
    });
  });

  describe.skip("GET /post/:id", () => {
    it("should return 200 OK", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).get(`/post/${post.id}`);
      expect(response.status).toBe(200);
    });

    it("should return a post page", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).get(`/post/${post.id}`);
      expect(response.text).toContain(`${post.title}`);
      expect(response.text).toContain(`${post.content}`);
      expect(response.text).toContain(`${post.author}`);
    });
  });

  describe("GET /edit/:id", () => {
    it.skip("should return 200 OK", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).get(`/edit/${post.id}`);
      expect(response.status).toBe(200);
    });

    it.skip("should return an edit page", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).get(`/edit/${post.id}`);
      expect(response.text).toContain(`${post.title}`);
      expect(response.text).toContain(`${post.content}`);
      expect(response.text).toContain("Save Changes");
      expect(response.text).toContain("Delete Post");
    });

    it("should return 401 not found if it can't find a post", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).get(`/edit/${post.id + 72}`);
      expect(response.status).toBe(401);
    });
  });
});

describe("POST Blog Routes", () => {
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

  describe("POST /create", () => {
    it.skip("should return 302 and create a new post", async () => {
      const response = await request(app).post("/create").type("form").send({
        title: "Test Post",
        author: "Tester",
        content: "This is a test post",
        signature: "",
      });

      expect(response.status).toBe(302);
    });
  });

  describe("POST /edit/:id", () => {
    it("should return 302 and edit a post", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app)
        .post(`/edit/${post.id}`)
        .type("form")
        .send({
          title: "new",
          content: "The contents of this post have been edited",
        });

      expect(response.status).toBe(302);
    });

    it("should return 404 if a post can't be found", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app)
        .post(`/edit/${post.id + 9999}`)
        .type("form")
        .send({
          title: "new",
          content: "The contents of this post have been edited",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("POST /delete/:id", () => {
    it("should return 302 and delete a post", async () => {
      const post = await BlogPost.findOne({ where: { title: "new" } });

      const response = await request(app).post(`/delete/${post.id}`).send();

      expect(response.status).toBe(302);
    });

    it("should return 404 if a post can't be found", async () => {
      const post = await BlogPost.findOne({ where: { title: "old" } });

      const response = await request(app)
        .post(`/delete/${post.id + 9999}`)
        .send();

      expect(response.status).toBe(404);
    });
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
    expect(response.text).toContain("Total length of all posts: 0.00 characters");
  });
});

