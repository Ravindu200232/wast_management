import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  request_id: {
    type: String,
    ref: 'FactoryWasteRequest',
    required: true
  },
  factory_id: {
    type: String,
    ref: 'RecyclingFactory',
    required: true
  },
  delivery_date: {
    type: Date
  },
  delivery_time_slot: {
    type: String
  },
  delivery_address: {
    type: String
  },
  delivery_contact: {
    type: String
  },
  delivery_status: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: { createdAt: 'order_date' }
});

const Order = mongoose.model('Order', orderSchema);
export default Order