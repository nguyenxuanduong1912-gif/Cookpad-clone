const dashboardRouter = require("./dashboard.router");
const accountRouter = require("./user.router");
const commentRouter = require("./comment.router");
const recipeRouter = require("./recipe.router");
const categoryRouter = require("./category.router");
module.exports = (app) => {
  app.use("/admin/api/dashboard", dashboardRouter);
  app.use("/admin/api/account", accountRouter);
  app.use("/admin/api/comment", commentRouter);
  app.use("/admin/api/recipe", recipeRouter);
  app.use("/admin/api/category", categoryRouter);
};
