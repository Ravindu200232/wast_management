// routes/pickupRoutes.js
import express from "express";
import { 
  requestExtraPickup, 
  getMyPickups, 
  assignPickupTeam,
  updatePickupStatus,
  updatePickupLocation,
  deletePickup,
  getAllPickups,
  getDriverPickups
} from "../controllers/extraPickupController.js";

const pickupRouter = express.Router();

// Resident routes
pickupRouter.post("/extra", requestExtraPickup);
pickupRouter.get("/extra", getMyPickups);

// Admin routes
pickupRouter.get("/extra/all", getAllPickups);
pickupRouter.put("/extra/:id/assign", assignPickupTeam);

// Driver routes
pickupRouter.get("/extra/driver", getDriverPickups);
pickupRouter.put("/extra/:id/status", updatePickupStatus);
pickupRouter.put("/extra/:id/location", updatePickupLocation);
pickupRouter.delete("/extra/:id", deletePickup);

export default pickupRouter;