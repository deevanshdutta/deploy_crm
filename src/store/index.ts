import { create } from 'zustand';
import { Customer, Segment, Campaign } from '../types';

interface CRMStore {
  customers: Customer[];
  segments: Segment[];
  campaigns: Campaign[];
  setCustomers: (customers: Customer[]) => void;
  setSegments: (segments: Segment[]) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addSegment: (segment: Segment) => void;
  addCampaign: (campaign: Campaign) => void;
}

export const useCRMStore = create<CRMStore>((set) => ({
  customers: [],
  segments: [],
  campaigns: [],
  setCustomers: (customers) => set({ customers }),
  setSegments: (segments) => set({ segments }),
  setCampaigns: (campaigns) => set({ campaigns }),
  addSegment: (segment) => set((state) => ({ segments: [...state.segments, segment] })),
  addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),
}));