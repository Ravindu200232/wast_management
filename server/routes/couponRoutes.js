import express from "express";
import { getMyCoupons, redeemCoupon } from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.get("/my-coupons", getMyCoupons);
couponRouter.post("/:id/redeem", redeemCoupon);

export default couponRouter;