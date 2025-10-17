import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  coupon_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  resident_id: {
    type: String,
    required: true,
  },
  coupon_code: {
    type: String,
    required: true,
    unique: true
  },
  coupon_type: {
    type: String
  },
  value: {
    type: Number,
    required: true
  },
  waste_weight_earned: {
    type: Number,
    required: true
  },
  expiry_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired'],
    default: 'active'
  },
  redeemed_at: {
    type: Date
  },
  partner_business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PartnerBusiness'
  }
}, {
  timestamps: { createdAt: 'issue_date' }
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;