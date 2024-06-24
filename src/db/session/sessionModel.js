import sessionSchema from "./sessionSchema.js";

// create new Token
export const insertSession = (obj) => sessionSchema(obj).save();

// find Token
export const findSession = (filter) => {
  return sessionSchema.findOne(filter);
};

// return all Tokens
export const deleteSession = (filter) => sessionSchema.findOneAndDelete(filter);
