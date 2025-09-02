import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const DogList = ({ 
  dogs, 
  shelters, 
  selectedShelter, 
  onShelterSelect, 
  onAddDog, 
  onEditDog, 
  onDeleteDog 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Dogs</h2>
        <div className="flex space-x-2">
          <select
            onChange={(e) => {
              const shelterId = e.target.value;
              const shelter = shelters.find(s => s.id.toString() === shelterId);
              onShelterSelect(shelter || null);
            }}
            className="border border-gray-300 rounded px-3 py-2 form-input"
            value={selectedShelter ? selectedShelter.id : ''}
          >
            <option value="">Select Shelter</option>
            {shelters.map(shelter => (
              <option key={shelter.id} value={shelter.id}>
                {shelter.name}
              </option>
            ))}
          </select>
          <button
            onClick={onAddDog}
            disabled={!selectedShelter}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedShelter 
                ? 'btn-primary' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Dog</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dogs.map((dog) => (
          <div key={dog.id} className="bg-white rounded-lg shadow-md p-6 card-hover">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{dog.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditDog(dog)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit dog"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteDog(dog)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete dog"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Breed:</span>
                <span className="text-sm text-gray-600">{dog.breed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Age:</span>
                <span className="text-sm text-gray-600">{dog.age} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Gender:</span>
                <span className="text-sm text-gray-600">{dog.gender}</span>
              </div>
              {dog.description && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Description:</span> {dog.description}
                  </p>
                </div>
              )}
              
              {/* Show which shelter this dog belongs to */}
              {(() => {
                const shelter = shelters.find(s => s.dogs && s.dogs.some(d => d.id === dog.id));
                return shelter ? (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-blue-600">
                      <span className="font-medium">Shelter:</span> {shelter.name}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        ))}
      </div>

      {dogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dogs found</h3>
          <p className="text-gray-500">Add some dogs to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DogList;
