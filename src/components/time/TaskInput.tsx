interface TaskInputProps {
  task: string;
  description: string;
  onTaskChange: (task: string) => void;
  onDescriptionChange: (description: string) => void;
  disabled?: boolean;
}

export default function TaskInput({
  task,
  description,
  onTaskChange,
  onDescriptionChange,
  disabled = false,
}: TaskInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task
        </label>
        <select
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Task</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Meeting">Meeting</option>
          <option value="Planning">Planning</option>
          <option value="Testing">Testing</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="What are you working on?"
        />
      </div>
    </div>
  );
}