import categoryRouter from "./categoryRouter.js";
import orderRouter from "./orderRouter.js";
import productRouter from "./productRouter.js";
import subCatRouter from "./subCategoryRouter.js";
import userRouter from "./userRouter.js";
import reviewRouter from "./reviewRouter.js";

export default [
  { path: "/api/v1/users", middlewares: [userRouter] },
  { path: "/api/v1/categories", middlewares: [categoryRouter] },
  { path: "/api/v1/products", middlewares: [productRouter] },
  { path: "/api/v1/sub-categories", middlewares: [subCatRouter] },
  { path: "/api/v1/orders", middlewares: [orderRouter] },
  { path: "/api/v1/reviews", middlewares: [reviewRouter] },
];
