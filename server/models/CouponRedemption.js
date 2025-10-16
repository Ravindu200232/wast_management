import mongoose from "mongoose";

const couponRedemptionSchema = new mongoose.Schema({
  redemption_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  coupon_id: {
    type: String,
    ref: 'Coupon',
    required: true
  },
  resident_id: {
    type: String,
    ref: 'Resident',
    required: true
  },
  business_id: {
    type: String,
    ref: 'PartnerBusiness',
    required: true
  },
  product_service: {
    type: String
  },
  verified_by: {
    type: String,
    ref: 'User'
  },
  notes: {
    type: String
  }
}, {
  timestamps: { createdAt: 'redemption_date' }
});

const CouponRedemption = mongoose.model('CouponRedemption', couponRedemptionSchema);
export default CouponRedemption