import { findSession } from "../db/session/sessionModel.js";
import { getAUser } from "../db/user/userModel.js";
import { verifyRefreshJwt, verifyAccessJwt } from "../utils/jwt.js";

// authenticate the user from access JWT
export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let message = "";

    const decoded = verifyAccessJwt(authorization);

    if (decoded?.email) {
      const session = await findSession({
        token: authorization,
        associate: decoded?.email,
      });

      if (session?._id) {
        const user = await getAUser({ email: decoded.email });

        if (user?._id && user?.status === "active" && user?.isEmailVerified) {
          // user.password = undefined;
          req.userInfo = user;
          return next();
        }

        if (user?.status === "inactive") {
          message = "Your account is not active, Contact Admin";
        }

        if (!user?.isEmailVerified) {
          message = "Your account is not verified, Check your email and verify";
        }
      }
    }

    console.log("Message from auth: ", decoded);
    // decoded.message
    next({
      status: 403,
      message: message || decoded,
    });
  } catch (error) {
    next(error);
  }
};

// authenticate the user from refresh JWT
export const jwtAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const decoded = verifyRefreshJwt(authorization);

    if (decoded?.email) {
      const user = await getAUser({
        email: decoded.email,
        refreshJWT: authorization,
      });

      if (user?._id && user?.refreshJWT === authorization) {
        // user.password = undefined;
        req.userInfo = user;
        return next();
      }
      return next({
        status: "error",
        message: "Invalid Token",
      });
    }

    next({
      status: 403,
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};
