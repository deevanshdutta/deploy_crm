// src/api/campaigns.ts
import { Campaign } from '../types';

// Example function to fetch campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await fetch('/api/campaigns');
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return response.json();
};

// Example function to create a campaign
export const createCampaignApi = async (newCampaign: Omit<Campaign, 'id'>) => {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(newCampaign),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
};

// Example function to send a campaign
export const sendCampaignApi = async (campaignId: string) => {
  const response = await fetch(`/api/campaigns/${campaignId}/send`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to send campaign');
  return response.json();
};
