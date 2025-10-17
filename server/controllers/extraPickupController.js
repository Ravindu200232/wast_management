// controllers/extraPickupController.js
import ExtraPickup from "../models/ExtraPickup.js";
import Resident from "../models/Resident.js";

export const requestExtraPickup = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }
    const resident = await Resident.findOne({ user_id: req.user.user_id });
    if (!resident) {
      return res.status(404).json({ message: "Resident profile not found" });
    }

    const pickup = new ExtraPickup({
      ...req.body,
      resident_id: resident.resident_id,
      pickup_address: resident.address || req.body.pickup_address
    });

    await pickup.save();
    res.status(201).json({ message: "Extra pickup requested", pickup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyPickups = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const resident = await Resident.findOne({ user_id: req.user.user_id });
    const pickups = await ExtraPickup.find({ resident_id: resident.resident_id });
    
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get driver's assigned extra pickups
export const getDriverPickups = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const pickups = await ExtraPickup.find({ 
      assigned_team_id: req.user.user_id 
    }).sort({ preferred_date: 1 });
    
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const assignPickupTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { assigned_team_id, driver_id, notes } = req.body;
    
    const pickup = await ExtraPickup.findOneAndUpdate(
      { pickup_id: req.params.id },
      { 
        assigned_team_id, 
        driver_id: driver_id || assigned_team_id,
        notes,
        status: 'assigned',
        assigned_date: new Date()
      },
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ message: "Pickup request not found" });
    }

    res.json({ message: "Team assigned to pickup", pickup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePickupStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, actual_weight, notes } = req.body;
    const updateData = { status };

    // Add date fields based on status
    if (status === 'assigned') {
      updateData.assigned_date = new Date();
    } else if (status === 'collected') {
      updateData.completed_date = new Date();
      updateData.actual_pickup_date = new Date();
    }

    // Add actual weight if provided
    if (actual_weight) {
      updateData.actual_weight = actual_weight;
    }

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    const pickup = await ExtraPickup.findOneAndUpdate(
      { pickup_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ message: "Pickup request not found" });
    }

    res.json({ message: "Pickup status updated", pickup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePickupLocation = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { current_location_lat, current_location_lng } = req.body;
    
    const pickup = await ExtraPickup.findOneAndUpdate(
      { pickup_id: req.params.id, assigned_team_id: req.user.user_id },
      { 
        current_location_lat,
        current_location_lng,
        location_updated_at: new Date()
      },
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ message: "Pickup request not found or not assigned to you" });
    }

    res.json({ message: "Location updated successfully", pickup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePickup = async (req, res) => {
  try {
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    // For drivers, only allow deletion if they are assigned to the pickup
    let query = { pickup_id: req.params.id };
    if (req.user.role === 'driver') {
      query.assigned_team_id = req.user.user_id;
    }

    const pickup = await ExtraPickup.findOneAndDelete(query);

    if (!pickup) {
      return res.status(404).json({ 
        message: "Pickup request not found" + 
        (req.user.role === 'driver' ? " or not assigned to you" : "")
      });
    }

    res.json({ message: "Pickup request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all extra pickups for admin
export const getAllPickups = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const pickups = await ExtraPickup.find().sort({ request_date: -1 });
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};