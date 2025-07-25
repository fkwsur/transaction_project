const express = require("express");
const app = express();
const cors = require("cors");
const Router = require("./routes");
const db = require("./models");
const helmet = require("helmet");
const compression = require("compression");
const yenv = require("yenv");
const env = yenv("environment.yaml", {
  env: "api_server",
});
const uuid = require("uuid");

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/v1/accounting", Router.accountingRouter);

const check_mysql_health = async () => {
  setInterval(async () => {
    try {
      await db.sequelize.authenticate();
    } catch (error) {
      console.log("db ping error : ", error);
    }
  }, 60000 * 3);
};

db.sequelize
  .authenticate()
  .then(async () => {
    try {
      const { sequelize } = require("./models");
      await sequelize.sync(true);
      console.log("db connect ok");
      await db.business_group.findOrCreate({
        where: { registration_number: "1111111111" },
        defaults: {
          id: uuid.v4(),
          business_group_name: "커머스 고객사",
          registration_number: "1111111111"
        },
      });
    } catch (err) {
      console.log("seq:", err);
    }
  })
  .catch(async (err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(0);
  });

require("http")
  .createServer(app)
  .listen(8081 || env.PORT, async () => {
    console.log("server on");
  });

check_mysql_health();
