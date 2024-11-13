import axios from 'axios';
import { Customer, Order, Campaign, Segment } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerAPI = {
  getAll: () => api.get<Customer[]>('/customers').then((res) => res.data),
  create: (customer: Omit<Customer, 'id'>) =>
    api.post<Customer>('/customers', customer).then((res) => res.data),
  updateVisit: (customerId: string) =>
    api.put<Customer>(`/customers/${customerId}/visit`).then((res) => res.data),
};

export const orderAPI = {
  getAll: () => api.get<Order[]>('/orders').then((res) => res.data),
  create: (order: Omit<Order, 'id'>) =>
    api.post<Order>('/orders', order).then((res) => res.data),
  updateStatus: (orderId: string, status: Order['status']) =>
    api.put<Order>(`/orders/${orderId}/status`, { status }).then((res) => res.data),
};

export const segmentAPI = {
  getAll: () => api.get<Segment[]>('/segments').then((res) => res.data),
  create: (segment: Omit<Segment, 'id' | 'audienceSize' | 'createdAt'>) =>
    api.post<Segment>('/segments', segment).then((res) => res.data),
};

export const campaignAPI = {
  getAll: () => api.get<Campaign[]>('/campaigns').then((res) => res.data),
  create: (campaign: Omit<Campaign, 'id' | 'sentCount' | 'failedCount' | 'createdAt' | 'status'>) =>
    api.post<Campaign>('/campaigns', campaign).then((res) => res.data),
  send: (campaignId: string) =>
    api.post<{ success: boolean; sentCount: number; failedCount: number }>(
      `/campaigns/${campaignId}/send`
    ).then((res) => res.data),
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);