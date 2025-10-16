import express from "express";
import { requestExtraPickup, getMyPickups, assignPickupTeam } from "../controllers/extraPickupController.js";

const pickupRouter = express.Router();

pickupRouter.post("/extra", requestExtraPickup);
pickupRouter.get("/extra", getMyPickups);
pickupRouter.put("/extra/:id/assign", assignPickupTeam);

export default pickupRouter;