import mongoose from "mongoose";

const collectionTeamSchema = new mongoose.Schema({
  team_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  team_name: {
    type: String,
    required: true
  },
  driver_id: {
    type: String,
    ref: 'User',
    required: true
  },
  helper_ids: {
    type: [String],
    ref: 'User'
  },
  vehicle_id: {
    type: String,
    ref: 'Vehicle'
  },
  assigned_route_id: {
    type: String,
    ref: 'Route'
  },
  status: {
    type: String,
    enum: ['available', 'on_duty', 'off_duty'],
    default: 'available'
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const CollectionTeam = mongoose.model('CollectionTeam', collectionTeamSchema);
export default CollectionTeam