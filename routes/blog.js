import { Router } from "express";
const router = Router();
import { BlogPost } from "../models/index.js";
import { Op, Sequelize } from "sequelize";
import {
  getAccountProfilePicture,
  profilePicturePaths,
} from "./shared-data.js";
import { tokenIsValid, FetchSessionId } from "./session-tokens.js";
//import { CONSTRAINT } from "sqlite3";

let accountProfilePicture;

router.get("/", async (req, res) => {
  const { q, sort } = req.query;

  let query = {};
  if (q) {
    query = {
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("title")),
          "LIKE",
          `%${q.toLowerCase()}%`
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("content")),
          "LIKE",
          `%${q.toLowerCase()}%`
        ),
      ],
    };
  }

  let sortOption = [];
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption.push([key, order.toUpperCase()]);
  } else {
    sortOption.push(["created_at", "DESC"]); // Default to newest first
  }

  const posts = await BlogPost.findAll({ where: query, order: sortOption });

  accountProfilePicture = getAccountProfilePicture();
  res.render("blog-posts/index", {
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
  res.render("blog-posts/create", {
    title: "Create Post",
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.post("/create", async (req, res) => {
  try {
    console.log("check if user is logged in"); //  console message to help debugging

    if (!tokenIsValid(req)) {
      return res.status(401).json({
        success: false,
        message: "UNAUTHORIZED: SESSION TOKEN IS INVALID OR MISSING",
      });
    }
    console.log("Session token was validated successfully"); // console message to help debigging
    const userSigniture = FetchSessionId(req);

    if (!userSigniture) {
      console.error("ERR - failed to retrueve the UUID from the sessiontoken");
      return res.status(401).json({
        success: false,
        message: "UNAUTHORIZED: SESSION TOKEN UUID NOT FOUND",
      });
    }
    console.log(`Creating a post with signiture: ${userSigniture}`);
    const newPost = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      signiture: userSigniture, // logged in uuid
    });
    res.status(201).json({
      success: true,
      message: "Blog post created!",
      post: newPost,
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create blog post" });
  }
});

router.get("/post/:id", async (req, res) => {
  if (!tokenIsValid(req)) {
    return res.status(401).send("Unauthorized");
  }
  const post = await BlogPost.findByPk(req.params.id);
  accountProfilePicture = getAccountProfilePicture();
  if (post) {
    const currentUserId = FetchSessionId(req);
    const postAuthor = post.signiture;

    console.log("post: " + postAuthor)
    console.log("current: " + currentUserId)
    res.render("blog-posts/post", {
      title: post.title,
      post,
      edit: postAuthor === currentUserId,
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else {
    res.status(404).send("Post not found");
  }
});

router.get("/edit/:id", async (req, res) => {
  if (!tokenIsValid(req)) {
    return res.status(401).send("Unauthorized");
  }
  const post = await BlogPost.findByPk(req.params.id);
  accountProfilePicture = getAccountProfilePicture();
  if (post) {
    const currentUserId = FetchSessionId(req);
    const postAuthor = post.signiture;

    if (postAuthor !== currentUserId) {
      return res
        .status(403)
        .send("Forbidden: you can only edit your own posts");
    }
    res.render("blog-posts/edit", {
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
  res.render("blog-posts/stats", {
    title: "Post Statistics",
    ...stats,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

export default router;
