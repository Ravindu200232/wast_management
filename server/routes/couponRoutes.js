// src/routes/couponRoutes.js
import express from "express";
import { 
  getAllCoupons, 
  getMyCoupons, 
  issueCoupon, 
  redeemCoupon, 
  deleteCoupon,
  getCouponStats 
} from "../controllers/couponController.js";

const couponRouter = express.Router();

// Public routes (with authentication)
couponRouter.get("/my-coupons", getMyCoupons);
couponRouter.post("/:id/redeem", redeemCoupon);

// Admin routes
couponRouter.get("/", getAllCoupons);
couponRouter.get("/stats", getCouponStats);
couponRouter.post("/issue", issueCoupon);
couponRouter.delete("/:id", deleteCoupon);

export default couponRouter;