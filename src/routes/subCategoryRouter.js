import express from "express";
import {
  getBrands,
  getOneBrand,
  insertBrand,
} from "../db/sub-category/brandModel.js";
import {
  getMaterials,
  getOneMaterial,
  insertMaterial,
} from "../db/sub-category/materialModel.js";
import slugify from "slugify";

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
subCatRouter.post("/", async (req, res, next) => {
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

export default subCatRouter;
