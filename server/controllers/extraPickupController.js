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

export const assignPickupTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { assigned_team_id } = req.body;
    
    const pickup = await ExtraPickup.findOneAndUpdate(
      { pickup_id: req.params.id },
      { assigned_team_id, status: 'assigned' },
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