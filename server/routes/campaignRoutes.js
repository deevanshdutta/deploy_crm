import express from 'express';
import {
  getCampaigns,
  createCampaign,
  sendCampaign,
} from '../controllers/campaignController.js';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id/send')
  .post(sendCampaign);

export default router;