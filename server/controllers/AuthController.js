import User from "../models/User.js";
import Resident from "../models/Resident.js";
import RecyclingFactory from "../models/RecyclingFactory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// User Registration
export async function register(req, res) {
  try {
    const { email, password, role, full_name, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const password_hash = bcrypt.hashSync(password, 10);

    // Create user
    const newUser = new User({
      email,
      password_hash,
      role,
      full_name,
      phone,
      address
    });

    await newUser.save();

    // Create role-specific profile
    if (role === 'resident') {
      const resident = new Resident({
        user_id: newUser.user_id,
        house_number: req.body.house_number,
        street: req.body.street,
        area: req.body.area,
        city: req.body.city,
        postal_code: req.body.postal_code
      });
      await resident.save();
    } else if (role === 'factory') {
      const factory = new RecyclingFactory({
        user_id: newUser.user_id,
        company_name: req.body.company_name,
        registration_number: req.body.registration_number,
        business_address: req.body.business_address,
        contact_person: req.body.contact_person
      });
      await factory.save();
    }

    res.json({
      message: "User Registration Successfully"
    });

  } catch (err) {
    res.status(503).json({
      error: err.message
    });
  }
}

// User Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, is_active: true });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password incorrect, please try again!" });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Get role-specific data
    let userDetails = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      profile_image: user.profile_image
    };

    if (user.role === 'resident') {
      const resident = await Resident.findOne({ user_id: user.user_id });
      userDetails = { ...userDetails, ...resident?._doc };
    } else if (user.role === 'factory') {
      const factory = await RecyclingFactory.findOne({ user_id: user.user_id });
      userDetails = { ...userDetails, ...factory?._doc };
    } else if (user.role === 'driver') {
      // Add driver specific details if needed
    }

    // Create token (same style as your example)
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone
      },
      process.env.SEKRET_KEY
    );

    res.json({
      message: "Login successful",
      token: token,
      user: userDetails
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to login",
      error: err.message
    });
  }
}

// Change Password
export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user_id = req.user.user_id;

    if (req.user == null) {
      return res.status(401).json({ message: "Please login" });
    }

    const user = await User.findOne({ user_id: user_id });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);
    await User.updateOne(
      { user_id: user_id },
      { password_hash: newPasswordHash, updated_at: new Date() }
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update password",
      error: err.message
    });
  }
}

// Get User Profile
export async function getProfile(req, res) {
  try {
    if (req.user == null) {
      return res.status(401).json({ message: "Please login" });
    }

    const user = await User.findOne({ user_id: req.user.user_id });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }

    let userDetails = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      profile_image: user.profile_image,
      created_at: user.created_at,
      last_login: user.last_login
    };

    // Add role-specific data
    if (user.role === 'resident') {
      const resident = await Resident.findOne({ user_id: user.user_id });
      userDetails.resident_details = resident;
    } else if (user.role === 'factory') {
      const factory = await RecyclingFactory.findOne({ user_id: user.user_id });
      userDetails.factory_details = factory;
    }

    res.json(userDetails);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: err.message
    });
  }
}

// Update User Profile
export async function updateProfile(req, res) {
  try {
    if (req.user == null) {
      return res.status(401).json({ message: "Please login" });
    }

    const { full_name, phone, address } = req.body;
    
    await User.updateOne(
      { user_id: req.user.user_id },
      { 
        full_name, 
        phone, 
        address, 
        updated_at: new Date() 
      }
    );

    res.json({
      message: "Profile updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message
    });
  }
}

// Check if user is Admin
export function isItAdmin(req) {
  let isAdmin = false;
  if (req.user != null) {
    if (req.user.role == "admin") {
      isAdmin = true;
    }
  }
  return isAdmin;
}

// Check if user is Resident
export function isItResident(req) {
  let isResident = false;
  if (req.user != null) {
    if (req.user.role == "resident") {
      isResident = true;
    }
  }
  return isResident;
}

// Check if user is Factory
export function isItFactory(req) {
  let isFactory = false;
  if (req.user != null) {
    if (req.user.role == "factory") {
      isFactory = true;
    }
  }
  return isFactory;
}

// Check if user is Driver
export function isItDriver(req) {
  let isDriver = false;
  if (req.user != null) {
    if (req.user.role == "driver") {
      isDriver = true;
    }
  }
  return isDriver;
}