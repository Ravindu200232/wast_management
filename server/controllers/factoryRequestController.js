import FactoryWasteRequest from "../models/FactoryWasteRequest.js";
import WasteInventory from "../models/WasteInventory.js";
import Notification from "../models/Notification.js";

export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'factory') {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = new FactoryWasteRequest({
      ...req.body,
      factory_id: req.user.user_id
    });

    await request.save();

    // Create notification for admin
    const notification = new Notification({
      user_id: 'admin', // This would need to be adjusted based on your admin user ID
      notification_type: 'request_status',
      title: 'New Waste Request',
      message: `New waste request submitted by factory`
    });
    await notification.save();

    res.status(201).json({ message: "Request submitted successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    if (req.user.role !== 'factory') {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await FactoryWasteRequest.find({ factory_id: req.user.user_id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const requests = await FactoryWasteRequest.find().populate('factory_id');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = await FactoryWasteRequest.findOneAndUpdate(
      { request_id: req.params.id },
      {
        status: 'approved',
        approved_by: req.user.user_id,
        approval_date: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request approved", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};