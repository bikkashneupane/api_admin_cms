import reviewSchema from "./reviewSchema.js";

// insert new review
export const insertReview = (obj) => {
  return reviewSchema(obj).save();
};

// find Review by Id
export const getReviewByFilter = (filter) => {
  return reviewSchema.findOne(filter);
};

// find all Review
export const getReviews = (filter) => {
  return reviewSchema.find(filter);
};

// update review
export const updateReview = (filter, obj) => {
  return reviewSchema.findOneAndUpdate(filter, obj);
};
