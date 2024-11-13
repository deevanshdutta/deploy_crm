import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Megaphone, Users } from 'lucide-react';
import useCampaigns from '../hooks/useCampaigns';
import useSegments from '../hooks/useSegments';
import { Segment } from '../types';

interface CampaignForm {
  name: string;
  segmentId: string;
  message: string;
  scheduledFor?: string;
}

export default function Campaigns() {
  const { campaigns, createCampaign, sendCampaign, isLoading: isCampaignLoading } = useCampaigns();
  const { segments, isLoading: isSegmentLoading, error } = useSegments();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CampaignForm>();
  const [previewMessage, setPreviewMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const safeSegments: Segment[] = Array.isArray(segments) ? segments : [];

  // Handle form submission for creating a new campaign
  const onSubmit = async (data: CampaignForm) => {
    try {
      await createCampaign({
        name: data.name,
        segmentId: data.segmentId,
        message: data.message,
        scheduledFor: data.scheduledFor,
        createdAt: new Date().toISOString(), // Setting default creation date
        status: 'draft', // Assuming 'draft' as default status
        sentCount: 0, // Initializing sent count
        failedCount: 0 // Initializing failed count
      });
      reset();
    } catch (error) {
      setErrorMessage('Failed to create campaign. Please try again.');
    }
  };

  // Handle sending an existing campaign with confirmation
  const handleSendCampaign = async (campaignId: string) => {
    const confirmation = window.confirm("Are you sure you want to send this campaign?");
    if (confirmation) {
      try {
        await sendCampaign(campaignId);
      } catch (error) {
        setErrorMessage('Failed to send campaign. Please try again.');
      }
    }
  };

  // Update the preview message when the user types in the message field
  const handleMessageChange = (message: string) => {
    setPreviewMessage(message.replace(/\[Name\]/g, 'John Doe')); // Replace placeholder [Name] with sample name
  };

  if (isCampaignLoading || isSegmentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading segments: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
      </div>

      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Campaign Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Campaign name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Spring Sale Announcement"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="segmentId" className="block text-sm font-medium text-gray-700">
              Target Segment
            </label>
            <select
              id="segmentId"
              {...register('segmentId', { required: 'Please select a segment' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a segment</option>
              {safeSegments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.name} ({segment.audienceSize} customers)
                </option>
              ))}
            </select>
            {errors.segmentId && <p className="text-sm text-red-600">{errors.segmentId.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message Template
            </label>
            <textarea
              id="message"
              {...register('message', { required: 'Message template is required' })}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
              placeholder="Hi [Name], we have a special offer for you!"
            />
            {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
            {previewMessage && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Preview:</p>
                <p className="mt-1 text-sm text-gray-900">{previewMessage}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">
              Schedule Send (Optional)
            </label>
            <input
              type="datetime-local"
              id="scheduledFor"
              {...register('scheduledFor')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Campaign History</h2>
        </div>
        {!campaigns || campaigns.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No campaigns created yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Created {format(new Date(campaign.createdAt), 'PPP')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-5 w-5 mr-1.5" />
                      <span>
                        {campaign.sentCount + campaign.failedCount} recipients
                      </span>
                    </div>
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md"
                      >
                        <Megaphone className="h-5 w-5 mr-2" />
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
