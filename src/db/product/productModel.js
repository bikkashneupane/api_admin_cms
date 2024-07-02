import productSchema from "./productSchema.js";

// create new Product
export const insertProduct = (obj) => productSchema(obj).save();

// find Product
export const getOneProduct = (filter) => {
  return productSchema.findOne(filter);
};

// find all Product
export const getProducts = (filter) => {
  return productSchema.find(filter);
};

// Update Product
export const updateProduct = (filter, obj) => {
  return productSchema.findOneAndUpdate(filter, obj, { new: true });
};

// Delete A Product
export const deleteProduct = (_id) => {
  return productSchema.findByIdAndDelete({ _id });
};

// Delete many Product
export const deleteManyProduct = (filter) => {
  return productSchema.deleteMany(filter);
};
