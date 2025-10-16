import Coupon from "../models/Coupon.js";
import Resident from "../models/Resident.js";

export const getMyCoupons = async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: "Access denied" });
    }

    const resident = await Resident.findOne({ user_id: req.user.user_id });
    const coupons = await Coupon.find({ 
      resident_id: resident.resident_id,
      status: 'active'
    });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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