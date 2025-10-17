import mongoose from "mongoose";

const recyclingRequestSchema = new mongoose.Schema({
  request_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  },
  factory_id: {
    type: String,
    ref: 'RecyclingFactory',
    required: true
  },
  waste_type: {
    type: String,
    required: true,
    enum: ['plastic', 'glass', 'metal', 'paper', 'electronic', 'general']
  },
  quantity_requested: {
    type: Number,
    required: true,
    min: 1
  },
  quantity_approved: {
    type: Number,
    default: 0
  },
  unit_price: {
    type: Number,
    default: 0
  },
  total_amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  request_date: {
    type: Date,
    default: Date.now
  },
  approval_date: {
    type: Date
  },
  completion_date: {
    type: Date
  },
  special_instructions: {
    type: String
  },
  admin_notes: {
    type: String
  },
  assigned_driver: {
    type: String,
    ref: 'User'
  },
  assigned_vehicle: {
    type: String,
    ref: 'Vehicle'
  },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pickup_schedule: {
    preferred_date: Date,
    preferred_time: String,
    actual_pickup_date: Date
  },
  items: [{
    name: String,
    category: String,
    quantity: Number,
    condition: String
  }]
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Pre-save middleware to calculate total amount
recyclingRequestSchema.pre('save', function(next) {
  if (this.quantity_approved && this.unit_price) {
    this.total_amount = this.quantity_approved * this.unit_price;
  }
  next();
});

const RecyclingRequest = mongoose.model('RecyclingRequest', recyclingRequestSchema);
export default RecyclingRequest;