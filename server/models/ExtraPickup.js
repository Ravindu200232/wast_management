// models/ExtraPickup.js
import mongoose from "mongoose";

const extraPickupSchema = new mongoose.Schema({
  pickup_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
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
    ref: 'User',
    required: false
  },
  driver_id: {
    type: String,
    ref: 'User',
    required: false
  },
  notes: {
    type: String
  },
  request_date: {
    type: Date,
    default: Date.now
  },
  assigned_date: {
    type: Date
  },
  completed_date: {
    type: Date
  },
  current_location_lat: {
    type: Number
  },
  current_location_lng: {
    type: Number
  },
  location_updated_at: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'request_date', updatedAt: 'updated_at' }
});

const ExtraPickup = mongoose.model('ExtraPickup', extraPickupSchema);
export default ExtraPickup;