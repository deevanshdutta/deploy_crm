import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { fetchCampaigns, createCampaignApi, sendCampaignApi } from '../hooks/campaigns';


import { Campaign } from '../types';

export default function useCampaigns() {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch campaigns using react-query
  const { data: campaigns, error: fetchError, refetch } = useQuery<Campaign[], Error>('campaigns', fetchCampaigns);

  // Mutation hook for creating a campaign
  const createCampaign = useMutation(
    async (newCampaign: Omit<Campaign, 'id'>) => {
      setIsLoading(true);
      try {
        const response = await createCampaignApi(newCampaign);
        refetch(); // Refetch the campaigns list after creation
        return response;
      } catch (error) {
        throw new Error('Failed to create campaign');
      } finally {
        setIsLoading(false);
      }
    },
    {
      onError: (error: Error) => {
        console.error(error.message);
      },
    }
  );

  // Mutation hook for sending a campaign
  const sendCampaign = useMutation(
    async (campaignId: string) => {
      setIsLoading(true);
      try {
        await sendCampaignApi(campaignId);
        refetch(); // Refetch the campaigns list after sending
      } catch (error) {
        throw new Error('Failed to send campaign');
      } finally {
        setIsLoading(false);
      }
    },
    {
      onError: (error: Error) => {
        console.error(error.message);
      },
    }
  );

  // Handling loading state and errors
  if (fetchError) {
    console.error('Error fetching campaigns:', fetchError);
  }

  return {
    campaigns: campaigns || [],
    createCampaign: createCampaign.mutate,
    sendCampaign: sendCampaign.mutate,
    isLoading,
  };
}
