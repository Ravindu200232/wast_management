import express from "express";
import { getInventory, getInventoryById, createInventory, updateInventory } from "../controllers/wasteInventoryController.js";

const inventoryRouter = express.Router();

inventoryRouter.get("/", getInventory);
inventoryRouter.get("/:id", getInventoryById);
inventoryRouter.post("/", createInventory);
inventoryRouter.put("/:id", updateInventory);

export default inventoryRouter;