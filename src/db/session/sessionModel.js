import sessionSchema from "./sessionSchema.js";

// create new Token
export const insertSession = async (obj) => await sessionSchema(obj).save();

// find Token
export const findSession = (filter) => {
  return sessionSchema.findOne(filter);
};

// return all Tokens
export const deleteSession = (filter) => sessionSchema.findOneAndDelete(filter);

// return all Tokens
export const deleteManySession = (filter) => {
  return sessionSchema.deleteMany(filter);
};
