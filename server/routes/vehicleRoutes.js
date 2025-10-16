// routes/vehicleRoutes.js
import express from "express";
import { 
  updateVehicleLocation, 
  trackVehicle, 
  getAllVehicles, 
  getResidentVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getDriverVehicle,
  getNearbyVehicles
} from "../controllers/vehicleController.js";

const vehicleRouter = express.Router();

vehicleRouter.post("/", createVehicle); // Add this line
vehicleRouter.put("/:id", updateVehicle); // Add this line
vehicleRouter.put("/:id/location", updateVehicleLocation);
vehicleRouter.get("/track/:vehicleId", trackVehicle);
vehicleRouter.get("/my-vehicle", getResidentVehicle);
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.delete("/:id", deleteVehicle);
vehicleRouter.get("/driver-vehicle", getDriverVehicle); 
vehicleRouter.get("/nearby", getNearbyVehicles); // New endpoint for nearby vehicles // Add this line

export default vehicleRouter;