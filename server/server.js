import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import factoryRequestRoutes from "./routes/factoryRequestRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware to verify token (same as your style)
app.use((req, res, next) => {
  let token = req.header("Authorization");

  if (token != null) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.SEKRET_KEY, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
    });
  }
  next();
});

const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection established successfully");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/factory/requests", factoryRequestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});