import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
//import { FetchSessionId, tokenIsValid } from "./session-tokens.js";

const BlogPost = sequelize.define(
  "BlogPost",
  {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    signiture: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export { sequelize, BlogPost };
