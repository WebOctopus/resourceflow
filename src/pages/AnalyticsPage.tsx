import { useState } from 'react';
import OverviewStats from '../components/dashboard/analytics/OverviewStats';
import ClientDistributionChart from '../components/dashboard/analytics/ClientDistributionChart';
import TimeAllocationChart from '../components/dashboard/analytics/TimeAllocationChart';
import TeamUtilizationChart from '../components/dashboard/analytics/TeamUtilizationChart';
import ProjectProgressTable from '../components/dashboard/analytics/ProjectProgressTable';

const timeRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last Quarter', value: 'quarter' },
  { label: 'Year to Date', value: 'ytd' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your agency's performance metrics and insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        <OverviewStats timeRange={timeRange} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientDistributionChart timeRange={timeRange} />
          <TimeAllocationChart timeRange={timeRange} />
        </div>
        
        <TeamUtilizationChart timeRange={timeRange} />
        <ProjectProgressTable timeRange={timeRange} />
      </div>
    </div>
  );
}