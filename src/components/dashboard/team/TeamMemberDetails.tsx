import { useState, useEffect } from 'react';
import { Clock, Briefcase, Mail, Phone, Edit2, ExternalLink, CheckCircle } from 'lucide-react';
import { TeamMember } from '../../../lib/types';
import EditTeamMemberModal from './EditTeamMemberModal';
import AbsenceTracker from './AbsenceTracker';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { formatDuration } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface TeamMemberDetailsProps {
  member: TeamMember;
}

export default function TeamMemberDetails({ member }: TeamMemberDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { clients, timeEntries } = useStore();
  const { activeTimers } = useTimerStore();
  const navigate = useNavigate();
  
  // Calculate total time for this member including historical entries
  const memberEntries = timeEntries.filter(entry => entry.userId === member.id);
  const memberTimers = activeTimers.filter(timer => timer.userId === member.id);

  // Calculate total work time including completed entries and active timers
  const completedWorkTime = memberEntries
    .filter(entry => entry.activityType === 'project')
    .reduce((sum, entry) => sum + entry.duration, 0);

  const activeWorkTime = memberTimers
    .filter(timer => timer.activityType === 'project')
    .reduce((total, timer) => {
      if (timer.isRunning && timer.startTime) {
        const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        return total + currentElapsed;
      }
      return total + timer.elapsed;
    }, 0);

  const totalWorkTime = completedWorkTime + activeWorkTime;
  
  // Calculate break time
  const completedBreakTime = memberEntries
    .filter(entry => entry.activityType === 'break')
    .reduce((sum, entry) => sum + entry.duration, 0);

  const activeBreakTime = memberTimers
    .filter(timer => timer.activityType === 'break')
    .reduce((total, timer) => {
      if (timer.isRunning && timer.startTime) {
        const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        return total + currentElapsed;
      }
      return total + timer.elapsed;
    }, 0);

  const totalBreakTime = completedBreakTime + activeBreakTime;

  // Get all projects
  const allProjects = clients.flatMap(client => client.projects);
  const assignedProjects = allProjects.filter(
    project => project.teamMembers?.includes(member.id)
  );
  const activeProjects = assignedProjects.filter(
    project => project.status !== 'Completed'
  );
  const completedProjects = assignedProjects.filter(
    project => project.status === 'Completed'
  );

  // Calculate utilization based on total time
  const workHoursPerMonth = 160; // Assuming 40 hours per week
  const utilization = Math.min(
    Math.round((totalWorkTime / (workHoursPerMonth * 3600)) * 100),
    100
  );

  // Update time display every second for active timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-medium text-gray-900">{member.name}</h2>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit Member
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Time This Month</h3>
              </div>
              <p className="mt-2 text-xl font-semibold text-indigo-600">
                {formatDuration(totalWorkTime)}
              </p>
              <p className="text-sm text-gray-500">
                Break: {formatDuration(totalBreakTime)}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Projects</h3>
              </div>
              <p className="mt-2 text-xl font-semibold text-indigo-600">
                {activeProjects.length}
              </p>
              <p className="text-sm text-gray-500">
                {completedProjects.length} completed
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Utilization</h3>
              </div>
              <p className="mt-2 text-xl font-semibold text-indigo-600">
                {utilization}%
              </p>
              <p className="text-sm text-gray-500">
                Based on {workHoursPerMonth}h/month
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>
              
              {/* Active Projects */}
              {activeProjects.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Active Projects</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {activeProjects.map((project) => {
                      const client = clients.find(c => 
                        c.projects.some(p => p.id === project.id)
                      );

                      // Calculate project-specific time
                      const projectEntries = memberEntries.filter(entry => entry.projectId === project.id);
                      const projectTimer = memberTimers.find(timer => timer.projectId === project.id);
                      
                      let projectTime = projectEntries.reduce((sum, entry) => sum + entry.duration, 0);
                      
                      if (projectTimer) {
                        if (projectTimer.isRunning && projectTimer.startTime) {
                          projectTime += Math.floor((Date.now() - projectTimer.startTime) / 1000);
                        } else {
                          projectTime += projectTimer.elapsed;
                        }
                      }

                      return (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {client?.name}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                                project.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {project.status}
                              </span>
                              <p className="text-sm text-gray-500 mt-2">
                                Time: {formatDuration(projectTime)}
                              </p>
                            </div>
                            <button
                              onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Project
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Projects */}
              {completedProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Completed Projects</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {completedProjects.map((project) => {
                      const client = clients.find(c => 
                        c.projects.some(p => p.id === project.id)
                      );

                      const projectEntries = memberEntries.filter(entry => entry.projectId === project.id);
                      const projectTime = projectEntries.reduce((sum, entry) => sum + entry.duration, 0);

                      return (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                                <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {client?.name}
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                Total Time: {formatDuration(projectTime)}
                              </p>
                              {project.completedDate && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Completed: {new Date(project.completedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Project
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeProjects.length === 0 && completedProjects.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No projects assigned yet.
                </p>
              )}
            </div>

            <AbsenceTracker userId={member.id} />
          </div>
        </div>
      </div>

      <EditTeamMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        member={member}
      />
    </>
  );
}