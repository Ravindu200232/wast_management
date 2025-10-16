import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  route_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  route_name: {
    type: String,
    required: true
  },
  area_covered: {
    type: String
  },
  start_point: {
    type: String
  },
  end_point: {
    type: String
  },
  estimated_duration: {
    type: Number
  },
  route_coordinates: {
    type: Object
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const Route = mongoose.model('Route', routeSchema); 
export default Route