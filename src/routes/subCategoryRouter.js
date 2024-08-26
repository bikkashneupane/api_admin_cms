import express from "express";
import {
  deleteBrand,
  getBrands,
  getOneBrand,
  insertBrand,
  updateBrandById,
} from "../db/sub-category/brandModel.js";
import {
  deleteMaterial,
  getMaterials,
  getOneMaterial,
  insertMaterial,
  updateMaterialById,
} from "../db/sub-category/materialModel.js";
import slugify from "slugify";
import { auth } from "../middleware/auth.js";

const subCatRouter = express.Router();

// Reusable function to check and insert items (brands/materials)
const checkAndInsertItems = async (items, getOneItem, insertItem, itemType) => {
  // Check if items already exist in the DB
  const checkPromises = items.map(async (item) => {
    const slug = slugify(item, { lower: true, trim: true });
    const existingItem = await getOneItem({ slug });
    return existingItem;
  });

  const existingItems = await Promise.all(checkPromises);

  if (existingItems.some((item) => item !== null)) {
    return {
      status: "error",
      message: `Some ${itemType}s already exist`,
    };
  }

  // Insert new items into the DB
  for (let item of items) {
    const slug = slugify(item, { lower: true, trim: true });
    const name = slugify(item, { trim: true });
    await insertItem({ name, slug });
  }

  return {
    status: "success",
    message: `${itemType}(s) added`,
  };
};

// Insert brand/material
subCatRouter.post("/", auth, async (req, res, next) => {
  try {
    const { brand, material } = req.body;

    if (!brand && !material) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Brand / Material",
      });
    }

    if (brand) {
      const brandResponse = await checkAndInsertItems(
        brand,
        getOneBrand,
        insertBrand,
        "Brand"
      );
      if (brandResponse.status === "error") {
        return res.status(400).json(brandResponse);
      }
      res.json(brandResponse);
    }

    if (material) {
      const materialResponse = await checkAndInsertItems(
        material,
        getOneMaterial,
        insertMaterial,
        "Material"
      );
      if (materialResponse.status === "error") {
        return res.status(400).json(materialResponse);
      }
      res.json(materialResponse);
    }
  } catch (error) {
    error.message = error.message.includes(
      "E11000 duplicate key error collection:"
    )
      ? "Some Brand or Material Already Exists"
      : error.message;
    next(error);
  }
});

// get Brands/ Materials
subCatRouter.get("/", async (req, res, next) => {
  try {
    const brands = await getBrands();
    const materials = await getMaterials();

    if (brands && materials) {
      return res.json({
        status: "success",
        brands,
        materials,
      });
    }

    res.json({
      status: "error",
      message: "Error fetching sub categories",
    });
  } catch (error) {
    next(error);
  }
});

// edit brand
subCatRouter.put("/edit-brand", auth, async (req, res, next) => {
  try {
    const { _id, name } = req.body;
    const brand = await updateBrandById(_id, { name });
    brand?._id
      ? res.json({
          status: "success",
          message: "Brand Edited",
        })
      : res.json({
          status: "eoor",
          message: "Couldn't edit brand, try again",
        });
  } catch (error) {
    next(error);
  }
});

// edit material
subCatRouter.put("/edit-material", auth, async (req, res, next) => {
  try {
    const { _id, name } = req.body;
    const material = await updateMaterialById(_id, { name });
    material?._id
      ? res.json({
          status: "success",
          message: "Material Edited",
        })
      : res.json({
          status: "error",
          message: "Couldn't edit material, try again",
        });
  } catch (error) {
    next(error);
  }
});

// delete brand
subCatRouter.delete("/delete-brand/:_id?", auth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const brand = await deleteBrand(_id);
    brand?._id
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

// delete material
subCatRouter.delete("/delete-material/:_id?", auth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const material = await deleteMaterial(_id);

    material?._id
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

export default subCatRouter;
