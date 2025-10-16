import mongoose from "mongoose";

const recyclingFactorySchema = new mongoose.Schema({
  factory_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  registration_number: {
    type: String,
    unique: true
  },
  business_address: {
    type: String
  },
  contact_person: {
    type: String
  },
  business_license: {
    type: String
  },
  verification_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const RecyclingFactory = mongoose.model('RecyclingFactory', recyclingFactorySchema);

export default RecyclingFactory;