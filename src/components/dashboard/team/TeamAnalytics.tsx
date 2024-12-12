import { useState, useEffect } from 'react';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { Clock, Coffee, Users, Calendar } from 'lucide-react';
import { formatDuration } from '../../../lib/utils';
import { calculateTeamMemberMetrics } from '../../../lib/utils/teamMetrics';

export default function TeamAnalytics() {
  const { teamMembers, timeEntries, clients } = useStore();
  const { activeTimers } = useTimerStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [metrics, setMetrics] = useState<Record<string, ReturnType<typeof calculateTeamMemberMetrics>>>({});

  // Update metrics every second to reflect active timers
  useEffect(() => {
    const calculateMetrics = () => {
      const newMetrics: Record<string, ReturnType<typeof calculateTeamMemberMetrics>> = {};
      
      teamMembers.forEach(member => {
        const projects = clients.flatMap(client => client.projects);
        newMetrics[member.id] = calculateTeamMemberMetrics(
          member,
          timeEntries,
          activeTimers,
          projects,
          clients
        );
      });

      setMetrics(newMetrics);
    };

    calculateMetrics();
    const intervalId = setInterval(calculateMetrics, 1000);

    return () => clearInterval(intervalId);
  }, [teamMembers, timeEntries, activeTimers, clients]);

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
          const memberMetrics = metrics[member.id];
          if (!memberMetrics) return null;

          const totalTime = memberMetrics.totalWorkTime + memberMetrics.breakTime + memberMetrics.meetingTime;
          const breakPercentage = totalTime > 0 ? Math.round((memberMetrics.breakTime / totalTime) * 100) : 0;
          const meetingPercentage = totalTime > 0 ? Math.round((memberMetrics.meetingTime / totalTime) * 100) : 0;

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
                    {breakPercentage}% of total time
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
                    {meetingPercentage}% of total time
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Projects</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-indigo-600">
                    {memberMetrics.activeProjects.length + memberMetrics.completedProjects.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    {memberMetrics.completedProjects.length} completed
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Active Projects</h4>
                  <div className="space-y-2">
                    {memberMetrics.activeProjects.map(project => (
                      <div key={project.id} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500">{project.clientName}</p>
                          </div>
                          <p className="text-sm font-medium text-indigo-600">
                            {formatDuration(project.totalTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Completed Projects</h4>
                  <div className="space-y-2">
                    {memberMetrics.completedProjects.map(project => (
                      <div key={project.id} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-500">{project.clientName}</p>
                          </div>
                          <p className="text-sm font-medium text-indigo-600">
                            {formatDuration(project.totalTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}