import mongoose from "mongoose";

const residentSchema = new mongoose.Schema({
  resident_id: {
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
  house_number: {
    type: String
  },
  street: {
    type: String
  },
  area: {
    type: String
  },
  city: {
    type: String
  },
  postal_code: {
    type: String
  },
  collection_route_id: {
    type: String,
    ref: 'Route'
  },
  reward_points: {
    type: Number,
    default: 0
  },
  total_waste_contributed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const Resident = mongoose.model('Resident', residentSchema);
export default Resident