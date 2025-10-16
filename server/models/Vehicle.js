import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicle_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  vehicle_number: {
    type: String,
    required: true,
    unique: true
  },
  vehicle_type: {
    type: String
  },
  capacity: {
    type: Number
  },
  current_location_lat: {
    type: Number
  },
  current_location_lng: {
    type: Number
  },
  last_location_update: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  driver_id: {
    type: String,
    required:false
  },
  fuel_level: {
    type: Number
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle