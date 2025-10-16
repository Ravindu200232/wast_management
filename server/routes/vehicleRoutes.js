import express from "express";
import { updateVehicleLocation, trackVehicle, getAllVehicles, getResidentVehicle } from "../controllers/vehicleController.js";

const vehicleRouter = express.Router();

vehicleRouter.put("/:id/location", updateVehicleLocation);
vehicleRouter.get("/track/:vehicleId", trackVehicle);
vehicleRouter.get("/my-vehicle", getResidentVehicle); // For residents to get their assigned vehicle
vehicleRouter.get("/", getAllVehicles);

export default vehicleRouter;