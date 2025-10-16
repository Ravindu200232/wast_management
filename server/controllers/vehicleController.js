import Vehicle from "../models/Vehicle.js";

export const updateVehicleLocation = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { current_location_lat, current_location_lng } = req.body;
    
    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicle_id: req.params.id },
      {
        current_location_lat,
        current_location_lng,
        last_location_update: new Date()
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Location updated", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const trackVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicle_id: req.params.vehicleId });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicles = await Vehicle.find().populate('driver_id');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};