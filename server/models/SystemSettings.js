import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  setting_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  setting_key: {
    type: String,
    required: true,
    unique: true
  },
  setting_value: {
    type: String,
    required: true
  },
  data_type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json'],
    default: 'string'
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  updated_by: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: { updatedAt: 'updated_at' }
});

const SystemSettings= mongoose.model('SystemSettings', systemSettingsSchema);
export default SystemSettings