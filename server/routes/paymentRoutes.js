import express from "express";
import { processPayment, getPaymentDetails } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", processPayment);
paymentRouter.get("/:orderId", getPaymentDetails);

export default paymentRouter;