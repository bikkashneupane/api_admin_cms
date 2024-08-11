import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const brandSchema = mongoose.model("Brand", schema);

// create new Brand
export const insertBrand = (obj) => brandSchema(obj).save();

// find Brand
export const getOneBrand = (filter) => {
  return brandSchema.findOne(filter);
};

// find all Brand
export const getBrands = (filter) => {
  return brandSchema.find(filter);
};

// Update Brand
export const updateBrand = (filter, obj) => {
  return brandSchema.findOneAndUpdate(filter, obj, { new: true });
};

// Delete A Brand
export const deleteBrand = (_id) => {
  return brandSchema.findByIdAndDelete({ _id });
};

// Delete many Brand
export const deleteManyBrand = (filter) => {
  return brandSchema.deleteMany(filter);
};
