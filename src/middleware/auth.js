import { deleteSession, findSession } from "../db/session/sessionModel.js";
import { getAUser, updateUser } from "../db/user/userModel.js";
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

    let message = "";
    const decoded = verifyAccessJwt(authorization);

    if (decoded?.email) {
      const session = await findSession({
        token: authorization,
        associate: decoded?.email,
      });

      if (session?._id) {
        const user = await getAUser({ email: decoded.email });

        if (user?._id && user?.isEmailVerified && user?.status === "active") {
          user.__v = undefined;
          req.userInfo = user;
          return next();
        }
        if (!user?.isEmailVerified) {
          message = "Your account is not verified, Check your email and verify";
        }
        if (user?.status === "inactive") {
          message = "Your account is not active, Contact Admin";
        }
      }
    }

    // 403 => unauthorised,  401 => unauthenticated
    next({
      status: message ? 403 : 401,
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
    if (!authorization) {
      return next({
        status: 401,
        message: "Authorization header is missing",
      });
    }

    let message = "";
    const decoded = verifyRefreshJwt(authorization);

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
      message = "Invalid Token";
    }

    next({
      status: message ? 403 : 401,
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};
