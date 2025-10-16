import express from "express";
import { 
  register, 
  login, 
  changePassword, 
  getProfile, 
  updateProfile 
} from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", getProfile);
authRouter.put("/profile", updateProfile);
authRouter.put("/change-password", changePassword);

export default authRouter;