import { Router } from "express";
const router = Router();
import { BlogPost } from "../models/index.js";

import { getAccountProfilePicture } from "./shared-data.js";
import {Op, Sequelize} from "sequelize";

let accountProfilePicture;

const profilePicturePaths = [
  "resources/profile-images/grey-profile-icon.png",
  "resources/profile-images/red-profile-icon.png",
  "resources/profile-images/green-profile-icon.png",
  "resources/profile-images/blue-profile-icon.png",
  "resources/profile-images/orange-profile-icon.png",
  "resources/profile-images/yellow-profile-icon.png",
  "resources/profile-images/turquoise-profile-icon.png",
  "resources/profile-images/purple-profile-icon.png",
  "resources/profile-images/pink-profile-icon.png",
  "resources/profile-images/black-profile-icon.png",
];

router.get("/", async (req, res) => {
  const { q, sort } = req.query;
  console.log("Search query:", q);
  console.log("Sort option:", sort);

  let query = {};
  if (q) {
    query = {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${q.toLowerCase()}%`),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('content')), 'LIKE', `%${q.toLowerCase()}%`)
      ]
    };
  }
  console.log("Query object:", query);

  let sortOption = [];
  if (sort) {
    const [key, order] = sort.split(':');
    sortOption.push([key, order.toUpperCase()]);
  } else {
    sortOption.push(['created_at', 'DESC']); // Default to newest first
  }
  console.log("Sort option array:", sortOption);

  const posts = await BlogPost.findAll({ where: query, order: sortOption });
  console.log("Sorted posts:", posts.map(post => post.title)); // Log the titles to check order

  accountProfilePicture = getAccountProfilePicture();
  res.render("index", {
    title: "Blog Posts",
    posts,
    q,
    sort,
    noPostsFound: posts.length === 0,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/create", (req, res) => {
  accountProfilePicture = getAccountProfilePicture();
  res.render("create", {
    title: "Create Post",
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.post("/create", async (req, res) => {
  await BlogPost.create(req.body);
  res.redirect("/");
});

router.get("/post/:id", async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  accountProfilePicture = getAccountProfilePicture();
  if (post) {
    res.render("post", {
      title: post.title,
      post,
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else {
    res.status(404).send("Post not found");
  }
});

router.get("/edit/:id", async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  accountProfilePicture = getAccountProfilePicture();
  if (post) {
    res.render("edit", {
      title: "Edit Post",
      post,
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else {
    res.status(404).send("Post not found");
  }
});

router.post("/edit/:id", async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (post) {
    await post.update(req.body);
    res.redirect(`/post/${post.id}`);
  } else {
    res.status(404).send("Post not found");
  }
});

router.post("/delete/:id", async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (post) {
    await post.destroy();
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

router.get("/stats", async (req, res) => {
  accountProfilePicture = getAccountProfilePicture();
  const posts = await BlogPost.findAll();
  const lengths = posts.map((post) => post.title.length + post.content.length);
  const stats = {
    average_length: lengths.reduce((a, b) => a + b, 0) / lengths.length,
    median_length: lengths.sort((a, b) => a - b)[
      Math.floor(lengths.length / 2)
    ],
    max_length: Math.max(...lengths),
    min_length: Math.min(...lengths),
    total_length: lengths.reduce((a, b) => a + b, 0),
  };
  res.render("stats", {
    title: "Post Statistics",
    ...stats,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

export default router;
