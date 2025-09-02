import React, { useState, useEffect } from 'react';

const DogForm = ({ dog, selectedShelter, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    description: ''
  });

  useEffect(() => {
    if (dog) {
      setFormData({
        ...dog,
        age: dog.age.toString()
      });
    } else {
      setFormData({
        name: '',
        breed: '',
        age: '',
        gender: 'Male',
        description: ''
      });
    }
  }, [dog]);

  const handleSubmit = () => {
    if (!formData.name || !formData.breed || !formData.age || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!dog && !selectedShelter) {
      alert('Please select a shelter first');
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
          {dog ? 'Edit Dog' : 'Add New Dog'}
          {selectedShelter && (
            <span className="text-sm text-gray-600 block">
              to {selectedShelter.name}
            </span>
          )}
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
              placeholder="Enter dog's name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed *
            </label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter dog's breed"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              placeholder="Enter dog's age"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 form-input"
              rows="3"
              placeholder="Enter description (optional)"
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
              disabled={loading || (!dog && !selectedShelter)}
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

export default DogForm;