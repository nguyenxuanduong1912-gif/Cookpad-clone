const accountsRouter = require("./accounts.router");
const commentsRouter = require("./comments.router");
const ratingsRouter = require("./ratings.router");
const recipesRouter = require("./recipes.router");
const searchHistoryRouter = require("./searchHistory.router");
const categoryGroupRoutes = require("./categoryGroup.router");
module.exports = (app) => {
  app.use("/api/accounts", accountsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/ratings", ratingsRouter);
  app.use("/api/recipes", recipesRouter);
  app.use("/api/search", searchHistoryRouter);
  app.use("/api/category-groups", categoryGroupRoutes);
};
