import express from "express";
import { getUserByEmail, insertUser } from "../db/user/userModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { newUserValidator } from "../middleware/joi.js";
import { signAccessJwt, signRefreshJwt } from "../utils/jwt.js";

const router = express.Router();

// register new user
router.post("/register", newUserValidator, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = await insertUser(req.body);
    user?._id
      ? res.json({
          status: "success",
          message: "User Registered",
        })
      : res.json({
          status: "error",
          message: "Admin Registration Failed, try again...",
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

    const user = await getUserByEmail(email);
    if (user?._id) {
      const isPassword = await comparePassword(password, user?.password);
      return isPassword
        ? res.json({
            status: "success",
            message: "Login Success..",
            tokens: {
              accessJWT: signAccessJwt({ email }),
              refreshJWT: signRefreshJwt({ email }),
            },
          })
        : res.json({
            status: "error",
            message: "Password Not Matched",
          });
    }
    res.json({
      status: "error",
      message: "Invalid Login Credential",
    });
  } catch (error) {
    next(error);
  }
});

// get user
router.get("/", (req, res, next) => {
  try {
    res.json({
      message: "chhh",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
