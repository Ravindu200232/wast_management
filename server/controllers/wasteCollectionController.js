import WasteCollection from "../models/WasteCollection.js";
import Resident from "../models/Resident.js";
import Coupon from "../models/Coupon.js";

export const recordCollection = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: "Access denied" });
    }

    const collection = new WasteCollection(req.body);
    await collection.save();

    // Update resident's total waste contributed
    await Resident.findOneAndUpdate(
      { resident_id: req.body.resident_id },
      { $inc: { total_waste_contributed: req.body.weight } }
    );

    // Check if coupon should be issued (business logic)
    if (req.body.weight >= 10) {
      const rewardPoints = req.body.weight * 10;
      if (rewardPoints >= 100) {
        const couponValue = rewardPoints / 10;
        
        const coupon = new Coupon({
          resident_id: req.body.resident_id,
          coupon_code: `CPN${Date.now()}`,
          coupon_type: 'waste_reward',
          value: couponValue,
          waste_weight_earned: req.body.weight,
          expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        });

        await coupon.save();
      }
    }

    res.status(201).json({ message: "Collection recorded", collection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCollectionHistory = async (req, res) => {
  try {
    let collections;
    
    if (req.user.role === 'resident') {
      const resident = await Resident.findOne({ user_id: req.user.user_id });
      collections = await WasteCollection.find({ resident_id: resident.resident_id });
    } else if (req.user.role === 'admin') {
      collections = await WasteCollection.find();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};