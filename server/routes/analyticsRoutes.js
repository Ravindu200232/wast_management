// routes/analyticsRoutes.js
import express from "express";
import { getSystemAnalytics } from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/system", getSystemAnalytics);

export default analyticsRouter;