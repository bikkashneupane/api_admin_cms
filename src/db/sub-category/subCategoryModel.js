import subCategorySchema from "./subCategorySchema.js";

// create new SubCategory
export const insertSubCategory = (obj) => subCategorySchema(obj).save();

// find SubCategory
export const getOneSubCategory = (filter) => {
  return subCategorySchema.findOne(filter);
};

// find all SubCategory
export const getSubCategories = (filter) => {
  return subCategorySchema.find(filter);
};

// Update SubCategory
export const updateSubCategory = (filter, obj) => {
  return subCategorySchema.findOneAndUpdate(filter, obj, { new: true });
};

// Delete A SubCategory
export const deleteSubCategory = (_id) => {
  return subCategorySchema.findByIdAndDelete({ _id });
};

// Delete many SubCategory
export const deleteManySubCategory = (filter) => {
  return subCategorySchema.deleteMany(filter);
};
