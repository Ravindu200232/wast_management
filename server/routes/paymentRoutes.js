import express from 'express';
import {
  processPayment,
  getPaymentDetails,
  getPaymentHistory,
  getAllPayments
} from '../controllers/paymentController.js';

const router = express.Router();

// Payment routes - no validation required
router.post('/process', processPayment);
router.get('/history/:factory_id', getPaymentHistory);
router.get('/all', getAllPayments); // Get all payments
router.get('/:paymentId', getPaymentDetails);

export default router;