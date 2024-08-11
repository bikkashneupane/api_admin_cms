import { auth } from "../middleware/auth.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import subCatRouter from "./subCategoryRouter.js";
import userRouter from "./userRouter.js";

export default [
  { path: "/api/v1/users", middlewares: [userRouter] },
  { path: "/api/v1/categories", middlewares: [auth, categoryRouter] },
  { path: "/api/v1/products", middlewares: [productRouter] },
  { path: "/api/v1/sub-categories", middlewares: [subCatRouter] },
];
