import express from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getMyOrders);
orderRouter.put("/:id", updateOrderStatus);

export default orderRouter;