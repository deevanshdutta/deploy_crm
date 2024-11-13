import asyncHandler from 'express-async-handler';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { evaluateSegment } from '../utils/segmentEvaluator.js';

// @desc    Get all segments
// @route   GET /api/segments
// @access  Private
export const getSegments = asyncHandler(async (req, res) => {
  const segments = await Segment.find({});
  res.json(segments);
});

// @desc    Create new segment
// @route   POST /api/segments
// @access  Private
export const createSegment = asyncHandler(async (req, res) => {
  const { name, conditions } = req.body;

  // Calculate audience size
  const customers = await Customer.find({});
  const audienceSize = customers.filter(customer => 
    evaluateSegment(customer, conditions)
  ).length;

  const segment = await Segment.create({
    name,
    conditions,
    audienceSize,
  });

  res.status(201).json(segment);
});