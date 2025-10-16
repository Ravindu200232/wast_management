import express from "express";
import { updateVehicleLocation, trackVehicle, getAllVehicles } from "../controllers/vehicleController.js";

const vehicleRouter = express.Router();

vehicleRouter.put("/:id/location", updateVehicleLocation);
vehicleRouter.get("/track/:vehicleId", trackVehicle);
vehicleRouter.get("/", getAllVehicles);

export default vehicleRouter;