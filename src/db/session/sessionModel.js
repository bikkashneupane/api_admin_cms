import sessionSchema from "./sessionSchema.js";

// create new Token
export const insertToken = (obj) => sessionSchema(obj).save;

// return all Tokens
export const findToken = (token) => sessionSchema.find({ token });
