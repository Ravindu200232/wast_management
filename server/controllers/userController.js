import User from "../models/User.js";
import Resident from "../models/Resident.js";
import RecyclingFactory from "../models/RecyclingFactory.js";

// Get All Users (Admin only)
export async function getAllUsers(req, res) {
  try {
    if (req.user == null || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Can't do this task" });
    }

    const users = await User.find({}, { password_hash: 0 });
    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: "Internal Server error",
      error: err.message
    });
  }
}

// Get User by ID (Admin only)
export async function getUserById(req, res) {
  try {
    if (req.user == null || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Can't do this task" });
    }

    const user_id = req.params.id;
    const user = await User.findOne({ user_id: user_id }, { password_hash: 0 });
    
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    let userDetails = { ...user._doc };

    // Add role-specific data
    if (user.role === 'resident') {
      const resident = await Resident.findOne({ user_id: user_id });
      userDetails.resident_details = resident;
    } else if (user.role === 'factory') {
      const factory = await RecyclingFactory.findOne({ user_id: user_id });
      userDetails.factory_details = factory;
    }

    res.json(userDetails);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: err.message
    });
  }
}

// Update User (Admin only)
export async function updateUser(req, res) {
  try {
    if (req.user == null || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Can't do this task" });
    }

    const user_id = req.params.id;
    const data = req.body;

    await User.updateOne(
      { user_id: user_id },
      { ...data, updated_at: new Date() }
    );

    res.json({
      message: "User updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update user",
      error: err.message
    });
  }
}

// Delete User (Admin only - soft delete)
export async function deleteUser(req, res) {
  try {
    if (req.user == null || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Can't do this task" });
    }

    const user_id = req.params.id;

    await User.updateOne(
      { user_id: user_id },
      { is_active: false, updated_at: new Date() }
    );

    res.json({
      message: "User deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete user",
      error: err.message
    });
  }
}