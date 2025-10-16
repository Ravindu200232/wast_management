import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  log_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  table_name: {
    type: String,
    required: true
  },
  record_id: {
    type: String,
    required: true
  },
  old_values: {
    type: Object
  },
  new_values: {
    type: Object
  },
  ip_address: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    required: true
  }
}, {
  timestamps: { createdAt: 'timestamp' }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog