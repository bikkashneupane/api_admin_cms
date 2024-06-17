import bcrypt from "bcrypt";

// hashPassword
export const hashPassword = (plainPass) =>
  bcrypt.hashSync(plainPass, +process.env.SALT);

//compare Password
export const comparePassword = (plainPass, hashedPass) =>
  bcrypt.compare(plainPass, hashedPass);
