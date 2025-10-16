import express from "express";
import { 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  getResidentSchedules,
  getDriverSchedules 
} from "../controllers/collectionScheduleController.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/", getResidentSchedules); // For residents to view their schedules
scheduleRouter.get("/driver", getDriverSchedules); // For drivers to view their schedules
scheduleRouter.get("/all", getSchedules); // For admin to view all schedules
scheduleRouter.post("/", createSchedule);
scheduleRouter.put("/:id", updateSchedule);

export default scheduleRouter;