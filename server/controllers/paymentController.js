import Payment from "../models/Payment.js";

export const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method, amount, card_last_four } = req.body;

    console.log('Payment request received:', { order_id, payment_method, amount });

    // Generate unique transaction ID
    const transaction_id = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6)}`.toUpperCase();
    
    // Generate unique payment ID
    const payment_id = `PAY${Date.now()}${Math.random().toString(36).substr(2, 6)}`.toUpperCase();

    // Create payment record directly without validation
    const payment = new Payment({
      payment_id: payment_id,
      order_id: order_id,
      factory_id: 'factory_demo', // Default factory ID
      amount: amount || 100,
      payment_method: payment_method || 'card',
      card_last_four: card_last_four || '1234',
      transaction_id: transaction_id,
      status: 'success',
      gateway_response: {
        status: 'success',
        transaction_id: transaction_id,
        message: 'Payment processed successfully',
        timestamp: new Date()
      }
    });

    await payment.save();

    console.log('Payment processed successfully:', payment.payment_id);

    res.status(201).json({ 
      success: true,
      message: "Payment processed successfully", 
      data: {
        payment_id: payment.payment_id,
        transaction_id: payment.transaction_id,
        amount: payment.amount,
        status: payment.status,
        payment_date: payment.payment_date,
        order_id: payment.order_id
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { factory_id } = req.params;
    
    const payments = await Payment.find({ factory_id: factory_id || 'factory_demo' })
      .sort({ payment_date: -1 });

    res.json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
      error: error.message
    });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      payment_id: req.params.paymentId 
    });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all payments (for admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ payment_date: -1 });

    res.json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message
    });
  }
};