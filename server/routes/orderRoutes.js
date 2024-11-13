import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders
router.get('/', asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('customerId');
  res.json(orders);
}));

// Create new order
router.post('/', asyncHandler(async (req, res) => {
  const { customerId, amount, status } = req.body;
  const order = await Order.create({
    customerId,
    amount,
    status,
  });
  res.status(201).json(order);
}));

// Update order status
router.put('/:id/status', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.status = req.body.status;
  await order.save();
  res.json(order);
}));

export default router;