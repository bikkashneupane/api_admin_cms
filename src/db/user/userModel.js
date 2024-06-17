import userSchema from "./userSchema.js";

// create new user
export const insertUser = (obj) => userSchema(obj).save();

// return all users
export const getAllUsers = () => userSchema.find();

// return user by email
export const getUserByEmail = (email) => userSchema.findOne({ email });

// update user
export const updateUser = (email, obj) =>
  userSchema.findByIdAndUpdate({ email }, obj);

// delete user
export const deleteUserById = (_id) => userSchema.findByIdAndDelete(_id);
