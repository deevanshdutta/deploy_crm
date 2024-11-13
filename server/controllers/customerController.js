import asyncHandler from 'express-async-handler';
import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  res.json(customers);
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const customerExists = await Customer.findOne({ email });
  if (customerExists) {
    res.status(400);
    throw new Error('Customer already exists');
  }

  const customer = await Customer.create({
    name,
    email,
  });

  res.status(201).json(customer);
});

// @desc    Update customer visit
// @route   PUT /api/customers/:id/visit
// @access  Private
export const updateCustomerVisit = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  customer.visitCount += 1;
  customer.lastVisit = new Date();
  await customer.save();

  res.json(customer);
});