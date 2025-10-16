// controllers/vehicleController.js
import Vehicle from "../models/Vehicle.js";
import Resident from "../models/Resident.js";
import CollectionSchedule from "../models/CollectionSchedule.js";

// Create new vehicle
export const createVehicle = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    
    res.status(201).json({ message: "Vehicle created successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicle_id: req.params.id },
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicle = await Vehicle.findOneAndDelete({ vehicle_id: req.params.id });
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vehicle assigned to resident's route
export const getResidentVehicle = async (req, res) => {

  
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }
      console.log(req.user.user_id)
    
    // Get resident's route
    const resident = await Resident.findOne({ user_id: req.user.user_id });
     console.log(resident)
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

  console.log(req.user.role)
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicles = await Vehicle.find().populate('driver_id');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add this to your vehicleController.js
// Get vehicle assigned to current driver
export const getDriverVehicle = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const vehicle = await Vehicle.findOne({ 
      driver_id: req.user.user_id,
      status: { $in: ['active', 'maintenance'] }
    });

    if (!vehicle) {
      return res.json(null);
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Add this to your vehicleController.js

// Get vehicles within specified distance
export const getNearbyVehicles = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    const maxDist = parseFloat(maxDistance);

    // Get all active vehicles
    const vehicles = await Vehicle.find({ 
      status: 'active',
      current_location_lat: { $exists: true, $ne: null },
      current_location_lng: { $exists: true, $ne: null }
    }).populate('driver_id');
    

    // Calculate distance for each vehicle and filter by max distance
    const nearbyVehicles = vehicles.filter(vehicle => {
      const distance = calculateDistance(
        userLat,
        userLng,
        vehicle.current_location_lat,
        vehicle.current_location_lng
      );
      return distance <= maxDist;
    });

    res.json(nearbyVehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};