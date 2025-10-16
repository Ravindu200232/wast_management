import express from "express";
import { submitFeedback, getMyFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", submitFeedback);
feedbackRouter.get("/my-feedback", getMyFeedback);
feedbackRouter.get("/", getAllFeedback);

export default feedbackRouter;