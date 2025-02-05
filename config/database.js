import { Sequelize } from "sequelize";
import { join } from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: join(new URL('.', import.meta.url).pathname, "..", "database.sqlite"),
});

export default sequelize;
