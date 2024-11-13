import express from 'express';
import {
  getCustomers,
  createCustomer,
  updateCustomerVisit,
} from '../controllers/customerController.js';

const router = express.Router();

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id/visit')
  .put(updateCustomerVisit);

export default router;