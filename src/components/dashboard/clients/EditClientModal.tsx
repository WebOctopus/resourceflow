import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { Client, BillingModel, Currency } from '../../../lib/types';
import { useSettingsStore } from '../../../lib/store/settingsStore';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export default function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
  const { updateClient } = useStore();
  const { currency: defaultCurrency } = useSettingsStore();
  
  const [formData, setFormData] = useState({
    name: client.name,
    billingModel: client.billingModel,
    contractValue: client.contractValue?.toString() || '',
    hourlyRate: client.hourlyRate?.toString() || '',
    email: client.email,
    phone: client.phone || '',
    currency: client.currency || defaultCurrency,
    status: client.status,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const updatedClient: Client = {
        ...client,
        name: formData.name,
        billingModel: formData.billingModel as BillingModel,
        ...(formData.billingModel === 'contract' 
          ? { contractValue: parseFloat(formData.contractValue) }
          : { hourlyRate: parseFloat(formData.hourlyRate) }
        ),
        email: formData.email,
        phone: formData.phone,
        currency: formData.currency as Currency,
        status: formData.status as 'active' | 'inactive',
      };

      await updateClient(updatedClient);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Edit Client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Billing Model
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    formData.billingModel === 'contract'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, billingModel: 'contract' })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contract Value</p>
                      <p className="text-xs text-gray-500">Fixed project cost</p>
                    </div>
                    <input
                      type="radio"
                      checked={formData.billingModel === 'contract'}
                      onChange={() => setFormData({ ...formData, billingModel: 'contract' })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    formData.billingModel === 'hourly'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, billingModel: 'hourly' })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pay Per Hour</p>
                      <p className="text-xs text-gray-500">Time-based billing</p>
                    </div>
                    <input
                      type="radio"
                      checked={formData.billingModel === 'hourly'}
                      onChange={() => setFormData({ ...formData, billingModel: 'hourly' })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {formData.billingModel === 'contract' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contract Value ({formData.currency})
                </label>
                <input
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hourly Rate ({formData.currency})
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}