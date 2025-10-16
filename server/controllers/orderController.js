import Order from "../models/Order.js";
import FactoryWasteRequest from "../models/FactoryWasteRequest.js";

export const createOrder = async (req, res) => {
  try {
    const { request_id } = req.body;

    const request = await FactoryWasteRequest.findOne({ request_id });
    if (!request || request.status !== 'approved') {
      return res.status(400).json({ message: "Invalid or unapproved request" });
    }

    const order = new Order({
      request_id,
      factory_id: req.user.user_id,
      total_amount: request.total_amount
    });

    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ factory_id: req.user.user_id })
      .populate('request_id');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { delivery_status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { order_id: req.params.id },
      { delivery_status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};