import { useState } from 'react';
import { useTimer } from '../../lib/hooks/useTimer';
import TimeDisplay from './TimeDisplay';
import TimerControls from './TimerControls';
import ProjectSelect from './ProjectSelect';
import TaskInput from './TaskInput';
import { useStore } from '../../lib/store';
import { generateId } from '../../lib/utils';

export default function WorkTimer() {
  const { clients, addTimeEntry } = useStore();
  const timer = useTimer();

  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    task: '',
    description: '',
  });

  const handleStop = () => {
    const finalTime = timer.stop();
    if (finalTime > 0) {
      addTimeEntry({
        id: generateId(),
        projectId: formData.projectId,
        userId: '1', // For demo purposes
        task: formData.task,
        description: formData.description,
        duration: finalTime,
        date: new Date().toISOString(),
        billable: true,
      });

      setFormData({
        clientId: '',
        projectId: '',
        task: '',
        description: '',
      });
    }
  };

  const canStart = formData.clientId && formData.projectId && formData.task;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Work Timer</h2>
        <TimeDisplay seconds={timer.elapsedTime} className="text-indigo-600" />
      </div>

      <div className="space-y-6">
        <ProjectSelect
          clients={clients}
          selectedClientId={formData.clientId}
          selectedProjectId={formData.projectId}
          onClientChange={(clientId) => setFormData(prev => ({ ...prev, clientId }))}
          onProjectChange={(projectId) => setFormData(prev => ({ ...prev, projectId }))}
          disabled={timer.isRunning}
        />

        <TaskInput
          task={formData.task}
          description={formData.description}
          onTaskChange={(task) => setFormData(prev => ({ ...prev, task }))}
          onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
          disabled={timer.isRunning}
        />

        <div className="flex justify-end">
          <TimerControls
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={handleStop}
            disabled={!canStart && !timer.isRunning}
          />
        </div>
      </div>
    </div>
  );
}