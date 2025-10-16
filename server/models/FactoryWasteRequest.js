import mongoose from "mongoose";

const factoryWasteRequestSchema = new mongoose.Schema({
  request_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  factory_id: {
    type: String,
    ref: 'RecyclingFactory',
    required: true
  },
  waste_type: {
    type: String,
    required: true
  },
  quantity_requested: {
    type: Number,
    required: true
  },
  special_instructions: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  admin_notes: {
    type: String
  },
  approved_by: {
    type: String,
    ref: 'User'
  },
  approval_date: {
    type: Date
  },
  total_amount: {
    type: Number
  }
}, {
  timestamps: { createdAt: 'request_date' }
});

const FactoryWasteRequest = mongoose.model('FactoryWasteRequest', factoryWasteRequestSchema);
export default FactoryWasteRequest