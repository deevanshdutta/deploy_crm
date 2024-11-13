import React from 'react';
import { Users, Target, Megaphone, TrendingUp } from 'lucide-react';
import { useCRMStore } from '../store';

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  suffix,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">
        {value}
        {suffix}
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const { customers, segments, campaigns } = useCRMStore();

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-400',
    },
    {
      title: 'Active Segments',
      value: segments.length,
      icon: Target,
      color: 'bg-green-400',
    },
    {
      title: 'Campaigns Sent',
      value: campaigns.filter(c => c.status === 'sent').length,
      icon: Megaphone,
      color: 'bg-purple-400',
    },
    {
      title: 'Message Success Rate',
      value: Math.round(
        (campaigns.reduce((acc, c) => acc + c.sentCount, 0) /
          (campaigns.reduce((acc, c) => acc + c.sentCount + c.failedCount, 0) || 1)) *
          100
      ),
      icon: TrendingUp,
      color: 'bg-yellow-400',
      suffix: '%',
    },
  ];

  return (
    <div className="space-y-8 px-6 py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Campaigns & Top Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Campaigns</h2>
          {campaigns.length === 0 ? (
            <p className="text-gray-500">No campaigns yet</p>
          ) : (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-500">
                      Sent: {campaign.sentCount} | Failed: {campaign.failedCount}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Segments</h2>
          {segments.length === 0 ? (
            <p className="text-gray-500">No segments created yet</p>
          ) : (
            <div className="space-y-4">
              {segments.slice(0, 5).map((segment) => (
                <div key={segment.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{segment.name}</p>
                    <p className="text-sm text-gray-500">
                      Audience size: {segment.audienceSize}
                    </p>
                  </div>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
