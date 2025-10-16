import FeedbackRating from "../models/FeedbackRating.js";
import Resident from "../models/Resident.js";

export const submitFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const resident = await Resident.findOne({ user_id: req.user.user_id });
    const feedback = new FeedbackRating({
      ...req.body,
      resident_id: resident.resident_id
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const resident = await Resident.findOne({ user_id: req.user.user_id });
    const feedback = await FeedbackRating.find({ resident_id: resident.resident_id });
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const feedback = await FeedbackRating.find().populate('resident_id');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};