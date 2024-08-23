import express from "express";
import { getOrders, updateOrder } from "../db/order/orderModel.js";

const router = express.Router();

// find all my orders
router.get("/", async (req, res, next) => {
  try {
    const { role } = req.userInfo;
    if (role === "admin") {
      const orders = await getOrders();
      return orders?.length > 0
        ? res.json({ status: "success", orders })
        : res.json({ status: "error", message: "No Orders Found" });
    }
    res.status(403).json({ status: "error", message: "Unauthorised" });
  } catch (error) {
    next(error);
  }
});

export default router;
