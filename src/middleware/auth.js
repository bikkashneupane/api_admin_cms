import { findSession } from "../db/session/sessionModel.js";
import { getAUser } from "../db/user/userModel.js";
import { verifyRefreshJwt, verifyAccessJwt } from "../utils/jwt.js";

// authenticate the user from access JWT
export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next({
        status: 401,
        message: "Authorization header is missing",
      });
    }

    const decoded = verifyAccessJwt(authorization);
    console.log("Decoded from auth: ", decoded);

    // Check if the token verification failed and returned an error message
    if (typeof decoded === "string") {
      return next({
        status: 401,
        message: decoded, // "jwt expired" or "Invalid Token"
      });
    }

    if (decoded?.email) {
      const session = await findSession({
        token: authorization,
        associate: decoded?.email,
      });

      console.log("session obj: ", session);
      if (session?._id) {
        const user = await getAUser({ email: decoded.email });

        if (user?._id) {
          if (!user?.isEmailVerified) {
            return next({
              status: 403,
              message:
                "Your account is not verified. Check your email and verify.",
            });
          }

          if (user?.status === "inactive") {
            return next({
              status: 403,
              message: "Your account is not active. Contact Admin.",
            });
          }

          // Attach user info in request and proceed
          user.__v = undefined;
          req.userInfo = user;
          return next();
        }
      }
    }

    // 403 => unauthorised,  401 => unauthenticated
    next({
      status: 403,
      message: "Unauthorized access.",
    });
  } catch (error) {
    next(error);
  }
};

// authenticate the user from refresh JWT
export const jwtAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next({
        status: 401,
        message: "Authorization header is missing",
      });
    }

    const decoded = verifyRefreshJwt(authorization);

    // Check if the token verification failed and returned an error message
    if (typeof decoded === "string") {
      return next({
        status: 401,
        message: decoded, // "jwt expired" or "Invalid Token"
      });
    }
    if (decoded?.email) {
      const user = await getAUser({
        email: decoded.email,
        refreshJWT: authorization,
      });

      if (user?._id && user?.refreshJWT === authorization) {
        user.__v = undefined;
        req.userInfo = user;
        return next();
      }
    }

    return next({
      status: 403,
      message: "Invalid Token or unauthorized access.",
    });
  } catch (error) {
    next(error);
  }
};
