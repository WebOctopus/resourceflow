import { useState } from 'react';
import { Calendar, Stethoscope } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { formatDuration, calculateAbsenceDuration, generateId } from '../../../lib/utils';
import { AbsenceEntry } from '../../../lib/types';

interface AbsenceTrackerProps {
  userId: string;
}

export default function AbsenceTracker({ userId }: AbsenceTrackerProps) {
  const { addAbsence, absences } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<AbsenceEntry, 'id' | 'userId'>>({
    type: 'sick',
    date: new Date().toISOString().split('T')[0],
    duration: {
      days: 0,
      hours: 0,
      minutes: 0,
    },
    notes: '',
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter absences for the current user and month
  const userAbsences = absences.filter(absence => {
    const absenceDate = new Date(absence.date);
    return absence.userId === userId && 
           absenceDate.getMonth() === currentMonth &&
           absenceDate.getFullYear() === currentYear;
  });

  const sickLeave = userAbsences.filter(a => a.type === 'sick');
  const appointments = userAbsences.filter(a => a.type === 'appointment');

  // Calculate total sick days including partial days
  const totalSickDays = sickLeave.reduce((total, absence) => {
    const days = absence.duration.days;
    const hours = absence.duration.hours / 8; // Convert hours to partial days (assuming 8-hour workday)
    const minutes = absence.duration.minutes / (8 * 60); // Convert minutes to partial days
    return total + days + hours + minutes;
  }, 0);

  // Calculate total appointment time in seconds
  const totalAppointmentSeconds = appointments.reduce((total, absence) => {
    const days = absence.duration.days * 24 * 60 * 60;
    const hours = absence.duration.hours * 60 * 60;
    const minutes = absence.duration.minutes * 60;
    return total + days + hours + minutes;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAbsence: AbsenceEntry = {
      id: generateId(),
      userId,
      ...formData,
    };

    addAbsence(newAbsence);
    setShowAddForm(false);
    setFormData({
      type: 'sick',
      date: new Date().toISOString().split('T')[0],
      duration: {
        days: 0,
        hours: 0,
        minutes: 0,
      },
      notes: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Absence Tracking</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Absence
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Stethoscope className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Sick Leave</h4>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {totalSickDays.toFixed(1)} days
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {sickLeave.length} occurrences this month
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Appointments</h4>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {formatDuration(totalAppointmentSeconds)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {appointments.length} occurrences this month
            </p>
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sick' | 'appointment' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="sick">Sick Leave</option>
                <option value="appointment">Appointment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Days</label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration.days}
                  onChange={(e) => setFormData({
                    ...formData,
                    duration: { ...formData.duration, days: parseInt(e.target.value) || 0 }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.duration.hours}
                  onChange={(e) => setFormData({
                    ...formData,
                    duration: { ...formData.duration, hours: parseInt(e.target.value) || 0 }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.duration.minutes}
                  onChange={(e) => setFormData({
                    ...formData,
                    duration: { ...formData.duration, minutes: parseInt(e.target.value) || 0 }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Absence
              </button>
            </div>
          </form>
        )}

        {userAbsences.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Recent Absences</h4>
            <div className="space-y-3">
              {userAbsences.map((absence) => (
                <div
                  key={absence.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {absence.type === 'sick' ? 'Sick Leave' : 'Appointment'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(absence.date).toLocaleDateString()}
                      </p>
                      {absence.notes && (
                        <p className="text-sm text-gray-600 mt-1">{absence.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {absence.duration.days > 0 && `${absence.duration.days}d `}
                        {absence.duration.hours > 0 && `${absence.duration.hours}h `}
                        {absence.duration.minutes > 0 && `${absence.duration.minutes}m`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}