import express from "express";
import {
  getReviews,
  insertReview,
  updateReview,
} from "../db/review/reviewModel.js";
import { newReviewValidator } from "../middleware/joi.js";
import { getOrderByFilter } from "../db/order/orderModel.js";

const router = express.Router();

//post review
router.post("/", newReviewValidator, async (req, res, next) => {
  try {
    const { _id, firstName, lastName, profileImage } = req.userInfo;
    const { orderId, ...rest } = req.body;

    const productPurchased = await getOrderByFilter({
      orderId,
      userId: _id,
      profileImage,
      status: "Succeeded",
    });
    console.log("Product Purchased", productPurchased);
    if (productPurchased?._id) {
      const review = await insertReview({
        ...rest,
        userId: _id,
        userName: `${firstName} ${lastName}`,
      });

      return review?._id
        ? res.json({
            status: "success",
            message: "Thank you for your review",
          })
        : res.json({
            status: "error",
            message: "Couldn't add review, add again",
          });
    }
    res.json({
      status: "error",
      message: "Please purchase before leaving review",
    });
  } catch (error) {
    next(error);
  }
});

// fetch reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    reviews.length
      ? res.json({
          status: "success",
          message: "",
          reviews,
        })
      : res.json({
          status: "error",
          message: "No reviews available currently.",
        });
  } catch (error) {
    next(error);
  }
});

// edit review
router.put("/", async (req, res, next) => {
  try {
    const { _id, status } = req.body;

    const updatedReview = await updateReview({ _id }, { status });

    updatedReview?._id
      ? res.json({
          status: "success",
          message: "Review Updated",
        })
      : res.json({
          status: "error",
          message: "Couldn't update review, try again",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
