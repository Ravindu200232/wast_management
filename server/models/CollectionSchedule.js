import mongoose from "mongoose";

const collectionScheduleSchema = new mongoose.Schema({
  schedule_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  route_id: {
    type: String,
    ref: 'Route',
    required: true
  },
  collection_date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  day_of_week: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  vehicle_id: {
    type: String,
    ref: 'Vehicle'
  },
  driver_id: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const CollectionSchedule = mongoose.model('CollectionSchedule', collectionScheduleSchema);
export default CollectionSchedule;