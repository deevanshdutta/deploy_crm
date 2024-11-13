import express from 'express';
import {
  getSegments,
  createSegment,
} from '../controllers/segmentController.js';

const router = express.Router();

router.route('/')
  .get(getSegments)
  .post(createSegment);

export default router;