import express from "express";
import { recordCollection, getCollectionHistory } from "../controllers/wasteCollectionController.js";

const collectionRouter = express.Router();

collectionRouter.post("/", recordCollection);
collectionRouter.get("/history", getCollectionHistory);

export default collectionRouter;