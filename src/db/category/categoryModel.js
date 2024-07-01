import categorySchema from "./categorySchema.js";

// create new Category
export const insertCategory = (obj) => categorySchema(obj).save();

// find Category
export const getOneCategory = (filter) => {
  return categorySchema.findOne(filter);
};

// find all Category
export const getCategories = (filter) => {
  return categorySchema.find(filter);
};

// Update Category
export const updateCategory = (filter, obj) => {
  return categorySchema.findOneAndUpdate(filter, obj, { new: true });
};

// Delete A Category
export const deleteCategory = (_id) => {
  return categorySchema.findByIdAndDelete({ _id });
};

// Delete many Category
export const deleteManyCategory = (filter) => {
  return categorySchema.deleteMany(filter);
};
