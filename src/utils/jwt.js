import JWT from "jsonwebtoken";
import { insertSession } from "../db/session/sessionModel.js";
import { updateUser } from "../db/user/userModel.js";

// sign access JWT
export const signAccessJwt = async (email) => {
  try {
    const token = JWT.sign({ email }, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    await insertSession({ token, associate: email });

    return token;
  } catch (error) {
    console.error("Error inserting session:", error);
  }
};

// verify access JWT
export const verifyAccessJwt = (token) => {
  try {
    return JWT.verify(token, process.env.ACCESS_SECRET_KEY);
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      return "jwt expired";
    }
    return "Invalid Token";
  }
};

// sign refresh JWT
export const signRefreshJwt = async (email) => {
  try {
    const refreshJWT = JWT.sign({ email }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });

    await updateUser({ email }, { refreshJWT });
    return refreshJWT;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// verify refresh JWT
export const verifyRefreshJwt = (token) => {
  try {
    return JWT.verify(token, process.env.REFRESH_SECRET_KEY);
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      return "jwt expired";
    }
    return "Invalid Token";
  }
};

export const getTokens = async (email) => {
  const accessJWT = await signAccessJwt(email);
  const refreshJWT = await signRefreshJwt(email);

  return { accessJWT, refreshJWT };
};
