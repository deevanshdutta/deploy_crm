import asyncHandler from 'express-async-handler';
import Campaign from '../models/Campaign.js';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { evaluateSegment } from '../utils/segmentEvaluator.js';
import { sendMessage } from '../services/messageService.js';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
export const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({}).populate('segmentId');
  res.json(campaigns);
});

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
export const createCampaign = asyncHandler(async (req, res) => {
  const { name, segmentId, message, scheduledFor } = req.body;

  const segment = await Segment.findById(segmentId);
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found');
  }

  const campaign = await Campaign.create({
    name,
    segmentId,
    message,
    scheduledFor,
    status: scheduledFor ? 'scheduled' : 'draft',
  });

  res.status(201).json(campaign);
});

// @desc    Send campaign messages
// @route   POST /api/campaigns/:id/send
// @access  Private
export const sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate('segmentId');
  
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const segment = campaign.segmentId;
  const customers = await Customer.find({});
  const targetCustomers = customers.filter(customer => 
    evaluateSegment(customer, segment.conditions)
  );

  let sentCount = 0;
  let failedCount = 0;

  for (const customer of targetCustomers) {
    try {
      const personalizedMessage = campaign.message.replace(
        /\[Name\]/g,
        customer.name
      );
      
      const result = await sendMessage(customer.email, personalizedMessage);
      
      if (result.status === 'SENT') {
        sentCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      failedCount++;
    }
  }

  campaign.status = 'sent';
  campaign.sentCount = sentCount;
  campaign.failedCount = failedCount;
  await campaign.save();

  res.json({ success: true, sentCount, failedCount });
});