// routes/routeRoutes.js
import express from "express";
import { 
  getRoutes, 
  getRouteById, 
  createRoute, 
  updateRoute, 
  deleteRoute 
} from "../controllers/routeController.js";

const routeRouter = express.Router();

routeRouter.get("/", getRoutes);
routeRouter.get("/:id", getRouteById);
routeRouter.post("/", createRoute);
routeRouter.put("/:id", updateRoute);
routeRouter.delete("/:id", deleteRoute);

export default routeRouter;