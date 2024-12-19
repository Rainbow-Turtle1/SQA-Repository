import request from "supertest";
import express, { urlencoded } from "express";
import { sequelize } from "../models";
import blogRoutes from "../routes/blog";

const app = express();
app.set("view engine", "pug");
app.use(urlencoded({ extended: true }));
app.use("/", blogRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Blog Routes", () => {
  test("GET HOME PAGE / Expect CODE 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  // test('POST BLOG /create', async ()=>{
  //     const newPost = {
  //         title: 'Test Post',
  //         content: 'This is a test',
  //         author: 'The Tester'
  //     }

  //     const response = await request(app)
  //         .post('/create')
  //         .send(newPost)
  //         // .expect(200)

  //     const foundPost = await BlogPost.findOne({ where: {title: newPost.title}});
  //     expect(post).not.toBeNull();
  //     expect(post.content).toBe(newPost.content)
  // })
});