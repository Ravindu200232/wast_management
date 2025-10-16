import express from "express";
import { createRequest, getMyRequests, getAllRequests, approveRequest } from "../controllers/factoryRequestController.js";

const factoryRequestRouter = express.Router();

factoryRequestRouter.post("/", createRequest);
factoryRequestRouter.get("/", getMyRequests);
factoryRequestRouter.get("/all", getAllRequests);
factoryRequestRouter.put("/:id/approve", approveRequest);

export default factoryRequestRouter;