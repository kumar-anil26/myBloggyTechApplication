const Category = require("../../models/Categories/Categories");

const asyncHandler = require("express-async-handler");
const User = require("../../models/Users/User");

//@desc new category
//@route post api/v1/categories
//@access private

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const isCategoryPresent = await Category.findOne({ name: name });
  if (isCategoryPresent) {
    throw new Error("Category Already Present!");
  }
  const category = await Category.create({
    name: name,
    author: req?.userAuth?._id,
  });
  res.json({
    status: "Success",
    message: "Category Created Successfully",
    CategoryData: category,
  });
});

//@ Describe Get all categories
//@ Public Router
//@ GET api/v1/categories
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).populate({
    path: "author",
    model: User,
    select: "username email role",
  });

  res.status(201).json({
    status: "Success",
    message: "All Categories SuccessFully Fetched",
    allCategories,
  });
});

//@ Describe Delete one Categories
//@Private Router
//@DELETE api/v1/category/:id

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryID = req.params.id;
  const deleteCategory = await Category.findByIdAndDelete(categoryID);
  res.status(201).json({
    status: "Success",
    message: "Category Deleted Successfully",
    deleteCategory,
  });
});

//@Describe Update Single Category
//@PUT api/v1/category/:id
//@Private Route

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const categoryID = req.params.id;
  const categoryName = req.body.name;
  const updateCategory = await Category.findByIdAndUpdate(
    categoryID,
    { name: categoryName },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    status: "Success",
    message: "Category update successfully",
    updateCategory,
  });
});
