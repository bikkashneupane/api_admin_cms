import express from "express";
import { deleteOrder, getOrders, updateOrder } from "../db/order/orderModel.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// find all my orders
router.get("/", auth, async (req, res, next) => {
  try {
    const orders = await getOrders();
    orders?.length > 0
      ? res.json({ status: "success", orders })
      : res.json({ status: "error", message: "No Orders Found" });
  } catch (error) {
    next(error);
  }
});

// delete Order
router.delete("/:_id?", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await deleteOrder(_id);

    order?._id
      ? res.json({ status: "success", message: "Order Deleted" })
      : res.json({
          status: "error",
          message: "Couldn't delete order, try again",
        });
  } catch (error) {
    next(error);
  }
});

// edit Order
router.put("/", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id, orderStatus } = req.body;

    const order = await updateOrder({ _id }, { orderStatus });
    order?._id
      ? res.json({
          status: "success",
          message: "Order Status Updated",
        })
      : res.json({
          status: "error",
          message: "Couldn't edit order, try again",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
