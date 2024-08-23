import express from "express";
import {
  getAllUsers,
  getAUser,
  insertUser,
  updateUser,
} from "../db/user/userModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { newUserValidator } from "../middleware/joi.js";
import { getTokens, signAccessJwt, signRefreshJwt } from "../utils/jwt.js";
import { auth, jwtAuth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import {
  accoundUpdateNotification,
  emailVerificationMail,
  sendOTPMail,
} from "../services/email/nodeMailer.js";
import {
  deleteManySession,
  deleteSession,
  findSession,
  insertSession,
} from "../db/session/sessionModel.js";
import { otpGenerator } from "../utils/random.js";

const router = express.Router();

// register new user
router.post("/register", newUserValidator, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);

    if (user?._id) {
      // create unique url and add in the database
      const token = uuidv4();
      const obj = {
        token,
        associate: user.email,
      };

      const result = await insertSession(obj);

      if (result?._id) {
        // process for sending email
        emailVerificationMail({
          email: user.email,
          firstName: user.firstName,
          url:
            process.env.FE_ROOT_URL + `/verify-user?c=${token}&e=${user.email}`,
        });

        return res.json({
          status: "success",
          message:
            "Account Created, Please check your email to verify  account!!",
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to create account, contact administration",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection:")) {
      error.message = "Email already in use...";
    }
    next(error);
  }
});

// user verification
router.post("/user-verification", async (req, res, next) => {
  try {
    const { c, e } = req.body;

    // delete session token
    const session = await deleteSession({
      token: c,
      associate: e,
    });

    if (session?._id) {
      // update admin table => make status active
      const user = await updateUser(
        { email: e },
        { status: "active", isEmailVerified: true }
      );

      if (user?._id) {
        return res.json({
          status: "success",
          message: "Your Account has been verified. You may login now!",
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid Link, Contact Admin",
    });
  } catch (error) {
    next(error);
  }
});

// login  user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email.includes("@", ".") || !password) {
      throw new Error("Invalid Data");
    }

    let message = "";

    const user = await getAUser({ email });

    if (user?._id && user?.status === "active" && user?.isEmailVerified) {
      const isPassword = await comparePassword(password, user?.password);

      return isPassword
        ? res.json({
            status: "success",
            message: "Login Success..",
            tokens: getTokens(user?.email),
          })
        : res.json({
            status: "error",
            message: "Password Not Matched",
          });
    }

    if (!user?.isEmailVerified) {
      message = "Your account is not verified, Check your email and verify";
    }

    if (user?.status === "inactive") {
      message = "Your account is not active, Contact Admin";
    }

    res.json({
      status: "error",
      message: message || "Invalid Login Credential",
    });
  } catch (error) {
    next(error);
  }
});

// get user profile
router.get("/", auth, (req, res, next) => {
  try {
    req.userInfo.password = undefined;
    req.userInfo.refreshJWT = undefined;

    res.json({
      status: "success",
      message: "User Authenticated",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// renew access
router.get("/renew-access", jwtAuth, (req, res, next) => {
  try {
    const { email } = req.userInfo;
    res.json({
      status: "success",
      message: "Access Renewed",
      accessJWT: signAccessJwt(email),
    });
  } catch (error) {
    next(error);
  }
});

// logout user
router.delete("/", jwtAuth, async (req, res, next) => {
  try {
    const { email } = req.userInfo;

    // update user
    await updateUser({ email }, { refreshJWT: "" });

    //update session table
    await deleteManySession({ associate: email });

    res.json({
      status: "success",
      message: "User Logged Out",
    });
  } catch (error) {
    next(error);
  }
});

// request OTP
router.post("/otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await getAUser({ email });

    if (user?._id) {
      const token = otpGenerator();
      console.log(token);

      const session = await insertSession({
        token,
        associate: email,
        type: "otp",
      });

      if (session?._id) {
        sendOTPMail({ email, token, firstName: user.firstName });
      }
    }

    res.json({
      status: "success",
      message:
        "If your email is found in the system, we will send you OTP to reset in your email",
    });
  } catch (error) {
    next(error);
  }
});

// resetPassword
router.post("/password/reset", async (req, res, next) => {
  try {
    const { otp, email, password } = req.body;
    console.log(otp, email, password);

    if ((otp, email, password)) {
      const user = await getAUser({ email });

      if (user?._id) {
        const session = await findSession({
          token: otp,
          type: "otp",
          associate: email,
        });

        if (session) {
          const updatedUser = await updateUser(
            { email },
            { password: hashPassword(password) }
          );

          if (updatedUser?._id) {
            accoundUpdateNotification({
              email,
              firstName: updatedUser.firstName,
            });

            // delete session
            await deleteSession({
              token: otp,
              type: "otp",
              associate: email,
            });

            return res.json({
              status: "success",
              message: "Password Reset Success",
            });
          }
        }
      }
    }

    res.json({
      status: "error",
      message: "Invalid data",
    });
  } catch (error) {
    next(error);
  }
});

// change password
router.post("/password/update", auth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { email, password } = req.userInfo;

    if (comparePassword(currentPassword, password)) {
      const user = await updateUser({ email }, { password: newPassword });

      user?._id
        ? res.json({
            status: "success",
            message: "Passowrd Updated",
          })
        : res.json({
            status: "error",
            message: "Passowrd Update Failed, try again",
          });
    }
    res.json({
      status: "error",
      message: "Passowrd Incorrect",
    });
  } catch (error) {
    next(error);
  }
});

// get all users
router.get("/all", auth, async (req, res, next) => {
  try {
    const users = await getAllUsers();

    const allUsers = users?.map((user) => {
      // Convert user to plain object to strip away internal properties
      const userObj = user.toObject ? user.toObject() : { ...user };

      const { password, refreshJWT, ...rest } = userObj;
      return rest;
    });

    res.json({
      status: "success",
      message: "User Authenticated",
      allUsers,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
