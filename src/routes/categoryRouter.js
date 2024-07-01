import express from "express";
import { auth } from "../middleware/auth.js";
import {
  deleteCategory,
  getCategories,
  insertCategory,
  updateCategory,
} from "../db/category/categoryModel.js";
// import { newCategoryValidator } from "../middleware/joi.js";
import slugify from "slugify";

const router = express.Router();

// add new category
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (typeof title === "string" && title.length) {
      const slug = slugify(title, {
        lower: true,
        trim: true,
      });

      const category = await insertCategory({ title, slug });
      return category?._id
        ? res.json({
            status: "success",
            message: "New Category Added",
          })
        : res.json({
            status: "error",
            message: "Unable to add new Category, try again",
          });
    }

    res.json({
      status: "error",
      message: "Invalid data",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection:")) {
      error.message =
        "This category slug already exist, please change the name of the Category and try agian.";
      error.status = 200;
    }
    next(error);
  }
});

// get category
router.get("/", async (req, res, next) => {
  try {
    const category = await getCategories();
    res.json({
      status: "success",
      message: "",
      category,
    });
  } catch (error) {
    next(error);
  }
});

// edit category
router.put("/", async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const category = await updateCategory({ _id }, { ...rest });

    category?._id
      ? res.json({
          status: "success",
          message: "Edit Success",
        })
      : res.json({
          status: "error",
          message: "Unable to update, try again",
        });
  } catch (error) {
    next(error);
  }
});

// delete category
router.delete("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const category = await deleteCategory(_id);

    category?._id
      ? res.json({
          status: "success",
          message: "Delete Success",
        })
      : res.json({
          status: "error",
          message: "Unable to delete, try again",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
