import React, { useState, useEffect } from 'react';

const ShelterForm = ({ shelter, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (shelter) {
      setFormData(shelter);
    } else {
      setFormData({
        name: '',
        location: '',
        email: '',
        phoneNumber: ''
      });
    }
  }, [shelter]);

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.email || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {shelter ? 'Edit Shelter' : 'Add New Shelter'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter shelter name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter location address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 btn-secondary rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 btn-primary rounded"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterForm;
