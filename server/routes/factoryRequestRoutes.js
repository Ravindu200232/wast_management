import express from "express";
import { 
  createRequest, 
  getMyRequests, 
  getAllRequests, 
  approveRequest,
  rejectRequest,
  completeRequest,
  getRequestById,
  updateRequest,
  deleteRequest
} from "../controllers/factoryRequestController.js";

const factoryRequestRouter = express.Router();

// Factory routes
factoryRequestRouter.post("/", createRequest);
factoryRequestRouter.get("/", getMyRequests);
factoryRequestRouter.get("/:id", getRequestById);
factoryRequestRouter.put("/:id", updateRequest);
factoryRequestRouter.delete("/:id", deleteRequest);

// Admin routes for managing requests
factoryRequestRouter.get("/admin/all", getAllRequests);
factoryRequestRouter.put("/admin/:id/approve", approveRequest);
factoryRequestRouter.put("/admin/:id/reject", rejectRequest);
factoryRequestRouter.put("/admin/:id/complete", completeRequest);

export default factoryRequestRouter;