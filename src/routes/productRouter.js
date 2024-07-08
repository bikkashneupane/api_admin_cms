import express from "express";
import {
  deleteProduct,
  getProducts,
  insertProduct,
  updateProduct,
} from "../db/product/productModel.js";
import slugify from "slugify";
import { newProductValidator } from "../middleware/joi.js";
import multerUpload from "../utils/uploadMulter.js";

const router = express.Router();

// add new product
router.post(
  "/",
  multerUpload.array("images", 5),
  newProductValidator,
  async (req, res, next) => {
    try {
      const { title, sku, ...rest } = req.body;
      if (typeof title === "string" && title.length) {
        const slug = slugify(title, {
          lower: true,
          trim: true,
        });

        // generate thumbnail path
        // generate images paths
        if (req.files?.length > 0) {
          const newImgs = req.files.map((item) => {
            return item.path.replace("public", "");
          });
          rest.images = newImgs;
          rest.thumbnail = newImgs[0];
        }

        const product = await insertProduct({
          ...rest,
          title,
          sku: sku?.toUpperCase(),
          slug,
        });

        return product?._id
          ? res.json({
              status: "success",
              message: "New Product Added",
            })
          : res.json({
              status: "error",
              message: "Unable to add new Product, try again",
            });
      }
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection:")) {
        error.message =
          "This product slug already exist, please change the name of the Product and try agian.";
        error.status = 200;
      }
      next(error);
    }
  }
);

// get product
router.get("/", async (req, res, next) => {
  try {
    const product = await getProducts();
    res.json({
      status: "success",
      message: "",
      product,
    });
  } catch (error) {
    next(error);
  }
});

// edit product
router.put("/", multerUpload.array("images", 5), async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const product = await updateProduct({ _id }, { ...rest });

    product?._id
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

// delete product
router.delete("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const product = await deleteProduct(_id);

    product?._id
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
