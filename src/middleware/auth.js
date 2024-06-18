import { findSession } from "../db/session/sessionModel.js";
import { getAUser } from "../db/user/userModel.js";
import { verifyRefreshJwt, verifyAccessJwt } from "../utils/jwt.js";

// authenticate the user from access JWT
export const auth = async (req, res, next) => {
  try {
    // TODO
    /**
     * 1. verify access JWT
     * 2. Check if token is present in session table
     * 3. Get email and get User By Email
     * 4. Update User(password) and return
     */

    const { authorization } = req.headers;

    const decoded = verifyAccessJwt(authorization);
    // if token verifies
    if (decoded?.email) {
      // get tokenObj from session table
      const tokenObj = await findSession(authorization);

      if (tokenObj?._id) {
        // get user by email
        const user = await getAUser(decoded.email);

        if (user?._id) {
          user.password = undefined;
          req.userInfo = user;
          return next();
        }
      }
    }

    // if token not verified
    next({
      status: 403,
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};

// authenticate the user from refresh JWT
export const jwtAuth = async (req, res, next) => {
  try {
    // TODO
    /**
     * 1. verify refresh JWT
     * 2.. Get email and get User By Email
     * 3. Check if refreshJWT matches in user table
     * 3. Update User(password) and return
     */

    const { authorization } = req.headers;

    const decoded = verifyRefreshJwt(authorization);

    if (decoded?.email) {
      const user = await getAUser(decoded.email);

      if (user?._id && user?.refreshJWT === authorization) {
        user.password = undefined;
        req.userInfo = user;
        return next();
      }
    }
    next({
      status: 403,
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};
