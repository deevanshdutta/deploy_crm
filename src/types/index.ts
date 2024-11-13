export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpending: number;
  lastVisit: string;
  visitCount: number;
}

export interface Order {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Segment {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  audienceSize: number;
  createdAt: string;
}

export interface SegmentCondition {
  field: string;
  operator: string;
  value: string | number;
  conjunction?: 'AND' | 'OR';
}

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  message: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentCount: number;
  failedCount: number;
  createdAt: string;
  scheduledFor?: string;
}