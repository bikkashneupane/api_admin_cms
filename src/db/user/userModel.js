import userSchema from "./userSchema.js";

// create new user
export const insertUser = (obj) => userSchema(obj).save();

// return all users
export const getAllUsers = () => userSchema.find();

// return user by filter
export const getAUser = (filter) => {
  console.log({ filter }, "herererere");
  return userSchema.findOne(filter);
};

// update user
export const updateUser = async (filter, obj) => {
  return await userSchema.findOneAndUpdate(filter, obj);
};

// delete user
export const deleteUserById = (_id) => userSchema.findByIdAndDelete(_id);
