// controllers/routeController.js
import Route from "../models/Route.js";

export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({ route_id: req.params.id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const route = new Route(req.body);
    await route.save();
    
    res.status(201).json({ message: "Route created successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const route = await Route.findOneAndUpdate(
      { route_id: req.params.id },
      req.body,
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route updated successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const route = await Route.findOneAndDelete({ route_id: req.params.id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};