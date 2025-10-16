import Vehicle from "../models/Vehicle.js";
import Resident from "../models/Resident.js";
import CollectionSchedule from "../models/CollectionSchedule.js";

// Get vehicle assigned to resident's route
export const getResidentVehicle = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get resident's route
    const resident = await Resident.findOne({ user_id: req.user.user_id });
    if (!resident || !resident.collection_route_id) {
      return res.json([]);
    }

    // Find today's schedule for resident's route
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedule = await CollectionSchedule.findOne({
      route_id: resident.collection_route_id,
      collection_date: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['scheduled', 'in_progress'] }
    }).populate('vehicle_id');

    if (!schedule || !schedule.vehicle_id) {
      return res.json([]);
    }

    res.json([schedule.vehicle_id]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Other existing methods remain the same...
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