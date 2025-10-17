import express from "express";
import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
  getAvailableDrivers,
  getAvailableVehicles,
  getAllResidents,
  getDriverSchedules,
  updateScheduleStatus
} from "../controllers/scheduleController.js";

const scheduleRouter = express.Router();

// Admin routes
scheduleRouter.post("/", createSchedule);
scheduleRouter.get("/", getAllSchedules);
scheduleRouter.put("/:id", updateSchedule);
scheduleRouter.delete("/:id", deleteSchedule);
scheduleRouter.get("/drivers", getAvailableDrivers);
scheduleRouter.get("/vehicles", getAvailableVehicles);
scheduleRouter.get("/residents", getAllResidents);

// Driver routes
scheduleRouter.get("/driver", getDriverSchedules);
scheduleRouter.put("/:id/status", updateScheduleStatus);

export default scheduleRouter;