import mongoose from "mongoose";

const wasteInventorySchema = new mongoose.Schema({
  inventory_id: {
    type: String,
    required: true,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  waste_type: {
    type: String,
    enum: ['plastic', 'glass', 'metal', 'paper', 'electronic'],
    required: true
  },
  category: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  unit_price: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  }
}, {
  timestamps: { createdAt: 'date_added', updatedAt: 'last_updated' }
});

const WasteInventory= mongoose.model('WasteInventory', wasteInventorySchema);
export default WasteInventory