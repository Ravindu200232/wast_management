import CollectionSchedule from "../models/CollectionSchedule.js";
import Resident from "../models/Resident.js";

// Get schedules for resident (based on their route)
export const getResidentSchedules = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get resident's route
    const resident = await Resident.findOne({ user_id: req.user.user_id });
    if (!resident || !resident.collection_route_id) {
      return res.json([]);
    }

    const schedules = await CollectionSchedule.find({ 
      route_id: resident.collection_route_id,
      collection_date: { $gte: new Date() }
    }).sort({ collection_date: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all schedules (Admin only)
export const getSchedules = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { route_id, date } = req.query;
    let filter = {};

    if (route_id) filter.route_id = route_id;
    if (date) filter.collection_date = new Date(date);

    const schedules = await CollectionSchedule.find(filter)
      .populate('vehicle_id')
      .populate('driver_id');
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Other existing methods remain the same...
export const createSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const schedule = new CollectionSchedule(req.body);
    await schedule.save();
    
    res.status(201).json({ message: "Schedule created", schedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const schedule = await CollectionSchedule.findOneAndUpdate(
      { schedule_id: req.params.id },
      req.body,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ message: "Schedule updated", schedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};