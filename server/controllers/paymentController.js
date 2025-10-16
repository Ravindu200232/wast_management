import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method, amount } = req.body;

    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = new Payment({
      order_id,
      factory_id: req.user.user_id,
      amount,
      payment_method,
      status: 'success', // In real app, this would be based on gateway response
      transaction_id: `TXN${Date.now()}`
    });

    await payment.save();

    // Update order payment status
    order.payment_status = 'completed';
    await order.save();

    res.status(201).json({ message: "Payment processed successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order_id: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};