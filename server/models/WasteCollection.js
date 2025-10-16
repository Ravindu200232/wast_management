import mongoose from "mongoose";

const wasteCollectionSchema = new mongoose.Schema({
  collection_id: {
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
  pickup_id: {
    type: String,
    ref: 'ExtraPickup'
  },
  schedule_id: {
    type: String,
    ref: 'CollectionSchedule'
  },
  waste_type: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  team_id: {
    type: String,
    ref: 'CollectionTeam',
    required: true
  },
  vehicle_id: {
    type: String,
    ref: 'Vehicle',
    required: true
  },
  location_lat: {
    type: Number
  },
  location_lng: {
    type: Number
  },
  photo_url: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: { createdAt: 'collection_date' }
});

const WasteCollection = mongoose.model('WasteCollection', wasteCollectionSchema);
export default WasteCollection