const express =  require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../../controllers/categories/categoryController');
const isLoggedIn = require('../../middlewares/isLoggedIn');

const categoryRouter =  express.Router();

//*Create Category
categoryRouter.post('/',isLoggedIn ,createCategory);

//*Get all categories
categoryRouter.get('/',isLoggedIn ,getCategories);

//*Update category
categoryRouter.put('/:id',isLoggedIn ,updateCategory);

//*Delete category
categoryRouter.delete('/:id',isLoggedIn ,deleteCategory);


module.exports = categoryRouter;