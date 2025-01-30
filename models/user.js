import { DataTypes, Sequelize } from "sequelize"; // Import Sequelize
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // ✅ Correct way
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { sequelize, User };
