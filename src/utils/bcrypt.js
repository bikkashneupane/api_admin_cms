import bcrypt from "bcrypt";

// hash Password
export const hashPassword = (plainPass) =>
  bcrypt.hashSync(plainPass, +process.env.SALT);

//compare Password
export const comparePassword = (plainPass, hashedPass) =>
  bcrypt.compare(plainPass, hashedPass);
