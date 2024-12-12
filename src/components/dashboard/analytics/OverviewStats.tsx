import { TrendingUp, TrendingDown, Users, Clock, DollarSign, PoundSterling, Briefcase } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { formatCurrency, formatDuration } from '../../../lib/utils';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../../lib/store/settingsStore';

interface OverviewStatsProps {
  timeRange: string;
}

export default function OverviewStats({ timeRange }: OverviewStatsProps) {
  const { clients, teamMembers, timeEntries } = useStore();
  const { activeTimers } = useTimerStore();
  const { currency: defaultCurrency } = useSettingsStore();
  const [stats, setStats] = useState({
    revenueUSD: 0,
    revenueGBP: 0,
    activeProjects: 0,
    utilization: 0,
    billableHours: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate revenue from contract clients
      const contractRevenue = {
        USD: clients
          .filter(client => client.billingModel === 'contract' && client.currency === 'USD')
          .reduce((sum, client) => sum + (client.contractValue || 0), 0),
        GBP: clients
          .filter(client => client.billingModel === 'contract' && client.currency === 'GBP')
          .reduce((sum, client) => sum + (client.contractValue || 0), 0),
      };

      // Calculate revenue from hourly clients including active timers
      const hourlyRevenue = {
        USD: 0,
        GBP: 0,
      };

      clients
        .filter(client => client.billingModel === 'hourly')
        .forEach(client => {
          // Get completed time entries
          const clientEntries = timeEntries.filter(entry =>
            client.projects.some(project => project.id === entry.projectId)
          );
          const completedHours = clientEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0);

          // Get active timer hours
          const activeHours = activeTimers
            .filter(timer => 
              client.projects.some(project => project.id === timer.projectId) &&
              timer.activityType === 'project'
            )
            .reduce((sum, timer) => {
              if (timer.isRunning && timer.startTime) {
                const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
                return sum + currentElapsed / 3600;
              }
              return sum + timer.elapsed / 3600;
            }, 0);

          const totalHours = completedHours + activeHours;
          const revenue = totalHours * (client.hourlyRate || 0);

          if (client.currency === 'USD') {
            hourlyRevenue.USD += revenue;
          } else {
            hourlyRevenue.GBP += revenue;
          }
        });

      const totalRevenueUSD = contractRevenue.USD + hourlyRevenue.USD;
      const totalRevenueGBP = contractRevenue.GBP + hourlyRevenue.GBP;

      // Calculate active projects
      const activeProjects = clients.reduce((sum, client) => 
        sum + client.projects.filter(p => p.status !== 'Completed').length, 0
      );

      // Calculate team utilization including active timers
      const avgUtilization = teamMembers.length > 0
        ? teamMembers.reduce((sum, member) => {
            const memberTimers = activeTimers.filter(timer => 
              timer.userId === member.id && 
              timer.activityType === 'project'
            );
            
            const totalSeconds = memberTimers.reduce((total, timer) => {
              if (timer.isRunning && timer.startTime) {
                const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
                return total + currentElapsed;
              }
              return total + timer.elapsed;
            }, 0);

            const hoursWorked = totalSeconds / 3600;
            const utilRate = (hoursWorked / (40 * 4)) * 100; // Assuming 4 weeks per month
            return sum + utilRate;
          }, 0) / teamMembers.length
        : 0;

      // Calculate billable hours including active timers
      const completedSeconds = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const activeSeconds = activeTimers
        .filter(timer => timer.activityType === 'project')
        .reduce((sum, timer) => {
          if (timer.isRunning && timer.startTime) {
            const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            return sum + currentElapsed;
          }
          return sum + timer.elapsed;
        }, 0);

      const billableHours = Math.round((completedSeconds + activeSeconds) / 3600);

      setStats({
        revenueUSD: totalRevenueUSD,
        revenueGBP: totalRevenueGBP,
        activeProjects,
        utilization: Math.round(avgUtilization),
        billableHours,
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [clients, teamMembers, timeEntries, activeTimers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(stats.revenueUSD, 'USD')}
                  </p>
                </div>
                <div className="flex items-center">
                  <PoundSterling className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(stats.revenueGBP, 'GBP')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {stats.activeProjects}
              </p>
            </div>
            <div className="bg-blue-100 rounded-md p-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+3.2%</span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Utilization</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {stats.utilization}%
              </p>
            </div>
            <div className="bg-purple-100 rounded-md p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span>-2.1%</span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Billable Hours</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {stats.billableHours}
              </p>
            </div>
            <div className="bg-indigo-100 rounded-md p-2">
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8.3%</span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}