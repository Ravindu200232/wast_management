import mongoose from "mongoose";

const partnerBusinessSchema = new mongoose.Schema({
  business_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  business_name: {
    type: String,
    required: true
  },
  business_type: {
    type: String
  },
  address: {
    type: String
  },
  contact_person: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  partnership_status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const PartnerBusiness = mongoose.model('PartnerBusiness', partnerBusinessSchema);
export default PartnerBusiness