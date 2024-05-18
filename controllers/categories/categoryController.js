const Category = require("../../model/Category/Category");
const asyncHandler = require("express-async-handler");

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;

  //! Check whether exist or not
  const categoryFound = await Category.findOne({ name });

  if (categoryFound) {
    throw new Error("Category already exists!");
  }

  const category = await Category.create({
    name: name,
    author: req.userAuth?._id,
  });

  res.status(401).json({
    status: "success",
    message: "Category created successfully!",
    category,
  });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.status(401).json({
    status: "success",
    message: "Category List Retrieved Successfully!",
    categories,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Category Deleted Successfully!",
  });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Category Updated Successfully!",
    category,
  });
});
