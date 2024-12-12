import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { generateId } from '../../../lib/utils';
import { Client, BillingModel, Currency } from '../../../lib/types';
import { useSettingsStore } from '../../../lib/store/settingsStore';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const addClient = useStore((state) => state.addClient);
  const { currency: defaultCurrency } = useSettingsStore();
  
  const [formData, setFormData] = useState({
    name: '',
    billingModel: 'contract' as BillingModel,
    contractValue: '',
    hourlyRate: '',
    email: '',
    phone: '',
    currency: defaultCurrency as Currency,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: generateId(),
      name: formData.name,
      billingModel: formData.billingModel,
      ...(formData.billingModel === 'contract' 
        ? { contractValue: parseFloat(formData.contractValue) }
        : { hourlyRate: parseFloat(formData.hourlyRate) }
      ),
      email: formData.email,
      phone: formData.phone,
      totalHours: 0,
      projects: [],
      status: 'active',
      currency: formData.currency,
    };

    addClient(newClient);
    setFormData({
      name: '',
      billingModel: 'contract',
      contractValue: '',
      hourlyRate: '',
      email: '',
      phone: '',
      currency: defaultCurrency,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Add New Client</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  type="text"
                  id="name"
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
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
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
                  <label htmlFor="contractValue" className="block text-sm font-medium text-gray-700">
                    Contract Value ({formData.currency})
                  </label>
                  <input
                    type="number"
                    id="contractValue"
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
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate ({formData.currency})
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Client
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}