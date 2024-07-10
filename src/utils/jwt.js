import JWT from "jsonwebtoken";
import { insertSession } from "../db/session/sessionModel.js";
import { updateUser } from "../db/user/userModel.js";

// sign access JWT
export const signAccessJwt = (email) => {
  const token = JWT.sign({ email }, process.env.ACCESS_SECRETE_KEY, {
    expiresIn: "10m",
  });

  insertSession({ token, associate: email });
  return token;
};

// verify access JWT
export const verifyAccessJwt = (token) => {
  try {
    return JWT.verify(token, process.env.ACCESS_SECRETE_KEY);
  } catch (error) {
    return error.message;
  }
};

// sign refresh JWT
export const signRefreshJwt = (email) => {
  const refreshJWT = JWT.sign({ email }, process.env.REFRESH_SECRETE_KEY, {
    expiresIn: "30d",
  });

  updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

// verify refresh JWT
export const verifyRefreshJwt = (token) => {
  try {
    return JWT.verify(token, process.env.REFRESH_SECRETE_KEY);
  } catch (error) {
    return error.message;
  }
};

export const getTokens = (email) => {
  return {
    accessJWT: signAccessJwt(email),
    refreshJWT: signRefreshJwt(email),
  };
};
