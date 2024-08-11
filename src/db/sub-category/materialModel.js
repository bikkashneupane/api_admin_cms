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

const materialSchema = mongoose.model("Material", schema);

// create new Material
export const insertMaterial = (obj) => materialSchema(obj).save();

// find Material
export const getOneMaterial = (filter) => {
  return materialSchema.findOne(filter);
};

// find all Material
export const getMaterials = (filter) => {
  return materialSchema.find(filter);
};

// Update Material
export const updateMaterial = (filter, obj) => {
  return materialSchema.findOneAndUpdate(filter, obj, { new: true });
};

// Delete A Material
export const deleteMaterial = (_id) => {
  return materialSchema.findByIdAndDelete({ _id });
};

// Delete many Material
export const deleteManyMaterial = (filter) => {
  return materialSchema.deleteMany(filter);
};
