import express from "express";
import { getAUser, insertUser, updateUser } from "../db/user/userModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { newUserValidator } from "../middleware/joi.js";
import { getTokens, signAccessJwt, signRefreshJwt } from "../utils/jwt.js";
import { auth } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import { emailVerificationMail } from "../services/email/nodeMailer.js";
import { deleteSession, insertSession } from "../db/session/sessionModel.js";

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
    req.userInfo.__v = undefined;
    req.userInfo.refreshJWT = undefined;

    console.log("here");
    res.json({
      status: "success",
      message: "",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
