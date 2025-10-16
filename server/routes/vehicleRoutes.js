// routes/vehicleRoutes.js
import express from "express";
import { 
  updateVehicleLocation, 
  trackVehicle, 
  getAllVehicles, 
  getResidentVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

const vehicleRouter = express.Router();

vehicleRouter.post("/", createVehicle); // Add this line
vehicleRouter.put("/:id", updateVehicle); // Add this line
vehicleRouter.put("/:id/location", updateVehicleLocation);
vehicleRouter.get("/track/:vehicleId", trackVehicle);
vehicleRouter.get("/my-vehicle", getResidentVehicle);
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.delete("/:id", deleteVehicle); // Add this line

export default vehicleRouter;