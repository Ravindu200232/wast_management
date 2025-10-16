import mongoose from "mongoose";

const extraPickupSchema = new mongoose.Schema({
  pickup_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  resident_id: {
    type: String,
    ref: 'Resident',
    required: true
  },
  waste_type: {
    type: String,
    required: true
  },
  estimated_volume: {
    type: Number
  },
  estimated_weight: {
    type: Number
  },
  pickup_address: {
    type: String
  },
  preferred_date: {
    type: Date
  },
  preferred_time: {
    type: String
  },
  actual_pickup_date: {
    type: Date
  },
  actual_weight: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'cancelled'],
    default: 'pending'
  },
  assigned_team_id: {
    type: String,
    ref: 'CollectionTeam'
  },
  notes: {
    type: String
  }
}, {
  timestamps: { createdAt: 'request_date' }
});

const ExtraPickup = mongoose.model('ExtraPickup', extraPickupSchema);
export default ExtraPickup