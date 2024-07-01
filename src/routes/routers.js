import { auth } from "../middleware/auth.js";
import categoryRouter from "./categoryRouter.js";
import userRouter from "./userRouter.js";

export default [
  { path: "/api/v1/users", middlewares: [userRouter] },
  { path: "/api/v1/categories", auth, middlewares: [categoryRouter] },
];
