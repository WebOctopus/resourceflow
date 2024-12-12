import TimeTracker from '../components/dashboard/time/TimeTracker';
import TimeEntries from '../components/dashboard/time/TimeEntries';

export default function TimeTrackingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Time Tracking</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track time spent on different projects and tasks
        </p>
      </div>
      <TimeTracker />
      <TimeEntries />
    </div>
  );
}