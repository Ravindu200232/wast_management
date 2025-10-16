import mongoose from "mongoose";

const feedbackRatingSchema = new mongoose.Schema({
  feedback_id: {
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
  collection_id: {
    type: String,
    ref: 'WasteCollection'
  },
  team_id: {
    type: String,
    ref: 'CollectionTeam'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  punctuality_rating: {
    type: Number,
    min: 1,
    max: 5
  },
  service_quality_rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comments: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: { createdAt: 'feedback_date' }
});

const FeedbackRating = mongoose.model('FeedbackRating', feedbackRatingSchema);
export default FeedbackRating