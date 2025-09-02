import React from "react";
import { Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";

const ShelterList = ({
  shelters,
  onAddShelter,
  onEditShelter,
  onDeleteShelter,
  onAddDog,
  onEditDog,
  onDeleteDog,
}) => {
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shelters</h2>
        <button
          onClick={onAddShelter}
          className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Shelter</span>
        </button>
      </div>

      {/* Shelter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-white rounded-lg shadow-md p-6 card-hover"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {shelter.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditShelter(shelter)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit shelter"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteShelter(shelter.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete shelter"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{shelter.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{shelter.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{shelter.phoneNumber}</span>
              </div>
            </div>

            {/* Dogs Section */}
            {shelter.dogs && shelter.dogs.length > 0 ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Dogs: {shelter.dogs.length}
                </p>
                <div className="space-y-1">
                  {shelter.dogs.slice(0, 3).map((dog) => (
                    <div
                      key={dog.id}
                      className="flex justify-between items-center text-xs text-gray-600"
                    >
                      <span>
                        {dog.name} ({dog.breed})
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onEditDog(shelter, dog)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit dog"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDeleteDog(dog.id, shelter.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete dog"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {shelter.dogs.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{shelter.dogs.length - 3} more...
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onAddDog(shelter)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Dog</span>
                </button>
              </div>
            ) : (
              /* No Dogs Section */
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">No dogs yet</p>
                <button
                  onClick={() => onAddDog(shelter)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add First Dog</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelterList;

        
