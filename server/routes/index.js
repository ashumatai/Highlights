const authRoutes = require("./authRoutes");
const eventRoutes = require("./events");

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/events", eventRoutes);

  app.use("*", (req, res) => {
    res.status(404).send("Page not found");
  });
};

module.exports = constructorMethod;
