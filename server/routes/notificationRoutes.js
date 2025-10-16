import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", getNotifications);
notificationRouter.put("/:id/read", markAsRead);
notificationRouter.put("/read-all", markAllAsRead);

export default notificationRouter;