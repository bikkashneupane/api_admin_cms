import sessionSchema from "./sessionSchema.js";

// create new Token
export const insertSession = (obj) => sessionSchema(obj).save();

// find Token
export const findSession = (token) => sessionSchema.findOne({ token });

// return all Tokens
export const deleteSession = (filter) => sessionSchema.findOneAndDelete(filter);
