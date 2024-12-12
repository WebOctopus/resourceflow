import { useState, useEffect } from 'react';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { Clock, Coffee, Users, Calendar } from 'lucide-react';
import { formatDuration } from '../../../lib/utils';

interface ActivityMetrics {
  totalWorkTime: number;
  breakTime: number;
  meetingTime: number;
  averageStartTime: string;
  averageEndTime: string;
  dailyMeetings: number;
}

const formatTimeString = (hours: number): string => {
  if (isNaN(hours) || hours < 0 || hours > 23) return 'N/A';
  return `${String(hours).padStart(2, '0')}:00`;
};

export default function TeamAnalytics() {
  const { teamMembers } = useStore();
  const { timeTracker } = useTimerStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [metrics, setMetrics] = useState<Record<string, ActivityMetrics>>({});

  useEffect(() => {
    const calculateMetricsForMember = (memberId: string) => {
      // Calculate total work time from project activity
      const totalWorkTime = timeTracker.project.elapsed;

      // Get break time from break activity
      const breakTime = timeTracker.break.elapsed;

      // Get meeting time from meeting activity
      const meetingTime = timeTracker.meeting.elapsed;

      // Calculate average start and end times based on project entries
      const workEntries = timeTracker.project.entries;
      const startTimes = workEntries.map(entry => new Date(entry.startTime).getHours());
      const endTimes = workEntries.map(entry => new Date(entry.endTime).getHours());

      const avgStart = startTimes.length > 0
        ? Math.round(startTimes.reduce((sum, time) => sum + time, 0) / startTimes.length)
        : 9; // Default to 9 AM

      const avgEnd = endTimes.length > 0
        ? Math.round(endTimes.reduce((sum, time) => sum + time, 0) / endTimes.length)
        : 17; // Default to 5 PM

      // Calculate daily meetings from meeting entries
      const meetingEntries = timeTracker.meeting.entries;
      const uniqueMeetingDays = new Set(
        meetingEntries.map(entry => new Date(entry.startTime).toDateString())
      ).size;

      const avgDailyMeetings = uniqueMeetingDays > 0
        ? Math.round(meetingEntries.length / uniqueMeetingDays)
        : 0;

      return {
        totalWorkTime,
        breakTime,
        meetingTime,
        averageStartTime: formatTimeString(avgStart),
        averageEndTime: formatTimeString(avgEnd),
        dailyMeetings: avgDailyMeetings,
      };
    };

    const newMetrics: Record<string, ActivityMetrics> = {};
    teamMembers.forEach(member => {
      newMetrics[member.id] = calculateMetricsForMember(member.id);
    });

    setMetrics(newMetrics);
  }, [teamMembers, timeTracker, selectedPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Team Activity Analysis</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'day' | 'week' | 'month')}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="day">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teamMembers.map(member => {
          const memberMetrics = metrics[member.id] || {
            totalWorkTime: 0,
            breakTime: 0,
            meetingTime: 0,
            averageStartTime: '09:00',
            averageEndTime: '17:00',
            dailyMeetings: 0,
          };

          return (
            <div key={member.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Work Hours</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-indigo-600">
                    {formatDuration(memberMetrics.totalWorkTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {memberMetrics.averageStartTime} - {memberMetrics.averageEndTime} avg.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Coffee className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Break Time</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-indigo-600">
                    {formatDuration(memberMetrics.breakTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round((memberMetrics.breakTime / (memberMetrics.totalWorkTime + memberMetrics.breakTime + memberMetrics.meetingTime)) * 100)}% of total time
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Meeting Time</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-indigo-600">
                    {formatDuration(memberMetrics.meetingTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round((memberMetrics.meetingTime / (memberMetrics.totalWorkTime + memberMetrics.breakTime + memberMetrics.meetingTime)) * 100)}% of total time
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Daily Meetings</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-indigo-600">
                    {memberMetrics.dailyMeetings}
                  </p>
                  <p className="text-sm text-gray-500">
                    meetings per day
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}