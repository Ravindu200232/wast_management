import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  notification_type: {
    type: String,
    enum: ['pickup_reminder', 'vehicle_nearby', 'coupon_issued', 'request_status', 'system_alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  action_url: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification