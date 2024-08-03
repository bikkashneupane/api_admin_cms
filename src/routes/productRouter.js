import express from "express";
import {
  deleteProduct,
  getProducts,
  insertProduct,
  updateProduct,
} from "../db/product/productModel.js";
import slugify from "slugify";
import { newProductValidator } from "../middleware/joi.js";
import multerUpload from "../utils/image-upload/multer.js";
import {
  cloudinaryUpload,
  validateImageCount,
  deleteCloudinaryImage,
} from "../utils/image-upload/cloudinary.js";

const router = express.Router();

// add new product
router.post(
  "/",
  multerUpload.array("images", 5),
  validateImageCount,
  newProductValidator,
  async (req, res, next) => {
    try {
      const { name, sku, salesPrice, salesStart, salesEnd, ...rest } = req.body;

      const isSales = salesPrice ? true : false;
      rest.sales = { isSales, salesPrice, salesStart, salesEnd };

      if (typeof name === "string" && name.length) {
        const slug = slugify(name, {
          lower: true,
          trim: true,
        });

        // generate thumbnail path
        // generate images paths
        // with multer and public/img/product path
        // if (req.files?.length > 0) {
        //   const newImgs = req.files.map((item) => {
        //     return item.path.replace("public", "");
        //   });
        //   rest.images = newImgs;
        //   rest.thumbnail = newImgs[0];
        // }

        // generate thumbnail and images path with cloudinary path
        if (req.files?.length > 0) {
          const imgURLs = await Promise.all(
            req.files.map((file) => cloudinaryUpload(file.path))
          );

          rest.images = imgURLs;
          rest.thumbnail = imgURLs[0];
        }
        const product = await insertProduct({
          ...rest,
          name,
          sku: sku?.toUpperCase(),
          slug,
        });

        if (product?._id) {
          return res.json({
            status: "success",
            message: "New Product Added",
          });
        }
      }
      res.json({
        status: "error",
        message: "Unable to add new Product, try again",
      });
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
router.put(
  "/",
  multerUpload.array("new-images", 5),
  validateImageCount,
  async (req, res, next) => {
    try {
      const { _id, images, salesPrice, salesStart, salesEnd, ...rest } =
        req.body;
      const isSales = salesPrice ? true : false;

      rest.sales = { isSales, salesPrice, salesStart, salesEnd };
      rest.images = images ? [...images] : null;
      rest.thumbnail = rest.images ? rest.images[0] : null;

      // upload images to cloudinary
      if (req.files?.length > 0) {
        const newImgURLs = await Promise.all(
          req.files.map((file) => cloudinaryUpload(file.path))
        );

        rest.images = rest.images
          ? [...rest.images, ...newImgURLs]
          : [...newImgURLs];
        rest.thumbnail = rest.images[0];
      }

      // update product and delete removed images from cloudinary
      const product = await updateProduct({ _id }, { ...rest });
      if (product?._id) {
        if (rest.images.length) {
          const imagesToDelete = product.images.filter(
            (item) => !rest.images.includes(item)
          );
          await deleteCloudinaryImage(imagesToDelete);
        }
        return res.json({
          status: "success",
          message: "Edit Success",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update, try again",
      });
    } catch (error) {
      next(error);
    }
  }
);

// delete product
router.delete("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const product = await deleteProduct(_id);

    if (product?._id) {
      // delete the images from cloudinary
      await deleteCloudinaryImage(products.images);
      return res.json({
        status: "success",
        message: "Delete Success",
      });
    }

    res.json({
      status: "error",
      message: "Unable to delete, try again",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
