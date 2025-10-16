import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  order_id: {
    type: String,
    ref: 'Order',
    required: true
  },
  factory_id: {
    type: String,
    ref: 'RecyclingFactory',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet'],
    required: true
  },
  card_last_four: {
    type: String
  },
  transaction_id: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  gateway_response: {
    type: Object
  }
}, {
  timestamps: { createdAt: 'payment_date' }
});

const  Payment= mongoose.model('Payment', paymentSchema);
export default Payment