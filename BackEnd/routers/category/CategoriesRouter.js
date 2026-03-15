const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/category/categoriesController");
const { isLoggedIn } = require("../../middlewares/isLoggedIn");

const categoriesRouter = express.Router();
//!Create Categories route
categoriesRouter.post("/", isLoggedIn, createCategory);

//! Fetch all categories route
categoriesRouter.get("/", getAllCategories);

//!Delete a Category
categoriesRouter.delete("/:id", isLoggedIn, deleteCategory);

//!Update A Category
categoriesRouter.put("/:id",isLoggedIn, updateCategory);

module.exports = categoriesRouter;
