import FactoryWasteRequest from "../models/FactoryWasteRequest.js";
import WasteInventory from "../models/WasteInventory.js";
import Notification from "../models/Notification.js";

export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'factory') {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log(req.body)

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

    const requests = await FactoryWasteRequest.find();
    console.log(requests)
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

export const rejectRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { admin_notes } = req.body;

    const request = await FactoryWasteRequest.findOneAndUpdate(
      { request_id: req.params.id },
      {
        status: 'rejected',
        approved_by: req.user.user_id,
        approval_date: new Date(),
        admin_notes: admin_notes || 'Request rejected by administrator'
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const completeRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = await FactoryWasteRequest.findOneAndUpdate(
      { request_id: req.params.id },
      {
        status: 'completed',
        completed_date: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request marked as completed", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await FactoryWasteRequest.findOne({ request_id: req.params.id });
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user has permission to view this request
    if (req.user.role === 'factory' && request.factory_id !== req.user.user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    if (req.user.role !== 'factory') {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = await FactoryWasteRequest.findOneAndUpdate(
      { request_id: req.params.id, factory_id: req.user.user_id, status: 'pending' },
      req.body,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found or cannot be modified" });
    }

    res.json({ message: "Request updated", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== 'factory') {
      return res.status(403).json({ message: "Access denied" });
    }

    const request = await FactoryWasteRequest.findOneAndDelete({
      request_id: req.params.id,
      factory_id: req.user.user_id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found or cannot be deleted" });
    }

    res.json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};