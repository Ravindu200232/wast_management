// src/controllers/couponController.js
import Coupon from "../models/Coupon.js";
import Resident from "../models/Resident.js";
import User from "../models/User.js";

// Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
  
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const coupons = await Coupon.find()
      .populate('resident_id')
      .populate('partner_business_id')
      .sort({ issue_date: -1 });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get resident's coupons
export const getMyCoupons = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const resident = await Resident.findOne({ user_id: req.user.user_id });
    
    if (!resident) {
      return res.status(404).json({ message: "Resident profile not found" });
    }
    console.log(resident,"hi")

    const coupons = await Coupon.find({ 
      resident_id: resident._id
    }).sort({ issue_date: -1 });

    

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Issue new coupon (Admin only)
export const issueCoupon = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const { resident_id, coupon_type, value, waste_weight_earned, expiry_days } = req.body;
    const Residents = await Resident.findOne({user_id : resident_id})
    const residentid = Residents.user_id;
    const user = await User.findOne({user_id : residentid})
    const userId = user._id;
    console.log(residentid)
    // Generate unique coupon code
    const coupon_code = `CPN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const coupon = new Coupon({
      resident_id : userId,
      coupon_code,
      coupon_type,
      value: parseFloat(value),
      waste_weight_earned: parseFloat(waste_weight_earned),
      expiry_date: new Date(Date.now() + expiry_days * 24 * 60 * 60 * 1000)
    });

    await coupon.save();

    // Update resident's reward points
    await Resident.findOneAndUpdate(
      { resident_id },
      { $inc: { reward_points: parseInt(value) * 10 } }
    );

    const populatedCoupon = await Coupon.findById(coupon._id).populate('resident_id');

    res.status(201).json({ 
      message: "Coupon issued successfully", 
      coupon: populatedCoupon 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Redeem coupon
export const redeemCoupon = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const coupon = await Coupon.findOne({ coupon_id: req.params.id });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.status !== 'active') {
      return res.status(400).json({ message: "Coupon is not active" });
    }

    if (coupon.expiry_date < new Date()) {
      coupon.status = 'expired';
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }

    coupon.status = 'redeemed';
    coupon.redeemed_at = new Date();
    await coupon.save();

    res.json({ message: "Coupon redeemed successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const coupon = await Coupon.findOneAndDelete({ coupon_id: req.params.id });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get coupon statistics (Admin only)
export const getCouponStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ status: 'active' });
    const redeemedCoupons = await Coupon.countDocuments({ status: 'redeemed' });
    const expiredCoupons = await Coupon.countDocuments({ status: 'expired' });
    
    const totalValue = await Coupon.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);

    const totalValueResult = totalValue.length > 0 ? totalValue[0].total : 0;

    res.json({
      totalCoupons,
      activeCoupons,
      redeemedCoupons,
      expiredCoupons,
      totalValue: totalValueResult
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};