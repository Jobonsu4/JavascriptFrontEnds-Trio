import React, { useState, useEffect } from 'react';
import { Dog, Home } from 'lucide-react'; // Icons for header buttons
import ShelterList from './components/ShelterList'; // Component to list shelters
import DogList from './components/DogList';           // Component to list dogs
import ShelterForm from './components/ShelterForm';   // Modal form for shelter
import DogForm from './components/DogForm';           // Modal form for dog

// API Base URL - adjust this to match your backend
const API_BASE = 'http://localhost:8080/api';

const App = () => {
  // State management
  const [shelters, setShelters] = useState([]);        // All shelters
  const [dogs, setDogs] = useState([]);               // All dogs
  const [currentView, setCurrentView] = useState('shelters'); // Current tab (shelters or dogs)
  const [loading, setLoading] = useState(false);      // Loading spinner
  const [error, setError] = useState('');             // Error messages
  const [selectedShelter, setSelectedShelter] = useState(null); // Selected shelter for dog actions
  
  // Modal state
  const [showShelterModal, setShowShelterModal] = useState(false); // Show/hide shelter form
  const [showDogModal, setShowDogModal] = useState(false);         // Show/hide dog form
  const [editingShelter, setEditingShelter] = useState(null);      // Shelter being edited
  const [editingDog, setEditingDog] = useState(null);              // Dog being edited

  // -------------------------
  // Fetch all shelters from backend
  // -------------------------
  const fetchShelters = () => {
    setLoading(true);
    fetch(API_BASE + '/shelter')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch shelters'); // Throw error if fetch fails
        return response.json(); // Parse JSON response
      })
      .then(data => {
        setShelters(data); // Save shelters to state
        setError('');      // Clear previous errors
        setLoading(false); // Stop loading spinner
      })
      .catch(err => {
        setError('Error fetching shelters: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Fetch all dogs from backend
  // -------------------------
  const fetchAllDogs = () => {
    setLoading(true);
    fetch(API_BASE + '/dog')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch dogs');
        return response.json();
      })
      .then(data => {
        setDogs(data); // Save dogs to state
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching dogs: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Create or Update Shelter
  // -------------------------
  const saveShelter = (shelterData) => {
    setLoading(true);

    // Determine API endpoint and method
    const url = editingShelter 
      ? API_BASE + '/shelter/' + editingShelter.id // Update existing shelter
      : API_BASE + '/shelter';                     // Create new shelter
    const method = editingShelter ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json', // Send JSON body
      },
      body: JSON.stringify(shelterData),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save shelter');
        return fetchShelters(); // Refresh shelter list
      })
      .then(() => {
        setShowShelterModal(false); // Close modal
        setEditingShelter(null);    // Reset editing state
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error saving shelter: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Delete Shelter
  // -------------------------
  const deleteShelter = (id) => {
    if (!window.confirm('Are you sure you want to delete this shelter?')) return;

    setLoading(true);
    fetch(API_BASE + '/shelter/' + id, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete shelter');
        return fetchShelters(); // Refresh shelter list
      })
      .then(() => {
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error deleting shelter: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Create or Update Dog
  // -------------------------
  const saveDog = (dogData) => {
    setLoading(true);

    let url, method;
    if (editingDog) {
      // Update existing dog
      url = API_BASE + '/dog/' + editingDog.id;
      method = 'PUT';
    } else {
      // Add new dog to selected shelter
      if (!selectedShelter) {
        setError('Please select a shelter first');
        setLoading(false);
        return;
      }
      url = API_BASE + '/dog/shelter/' + selectedShelter.id;
      method = 'POST';
    }

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dogData,
        age: parseInt(dogData.age), // Ensure age is a number
      }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save dog');
        return fetchAllDogs(); // Refresh dogs list
      })
      .then(() => fetchShelters()) // Refresh shelters list (so dogs inside shelters are updated)
      .then(() => {
        setShowDogModal(false);
        setEditingDog(null);
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error saving dog: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Delete Dog
  // -------------------------
  const deleteDog = (dogId, shelterId) => {
    if (!window.confirm('Are you sure you want to delete this dog?')) return;

    setLoading(true);
    fetch(API_BASE + '/dog/shelter/' + shelterId + '/dog/' + dogId, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete dog');
        return fetchAllDogs(); // Refresh dog list
      })
      .then(() => fetchShelters()) // Refresh shelters to remove deleted dog
      .then(() => {
        setError('');
        setLoading(false);
      })
      .catch(err => {
        setError('Error deleting dog: ' + err.message);
        setLoading(false);
      });
  };

  // -------------------------
  // Modal open functions
  // -------------------------
  const openShelterModal = (shelter = null) => {
    setEditingShelter(shelter);
    setShowShelterModal(true);
  };

  const openDogModal = (dog = null) => {
    setEditingDog(dog);
    setShowDogModal(true);
  };

  // -------------------------
  // Initial fetch on mount
  // -------------------------
  useEffect(() => {
    fetchShelters();
    fetchAllDogs();
  }, []);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="app-container">
      {/* Header */}
      <div className="bg-white header-shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Dog className="h-8 w-8 text-blue-600" /> {/* Icon */}
            <h1 className="text-3xl font-bold text-gray-900">Dog Shelter Management</h1>
          </div>
          <div className="flex space-x-2">
            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentView('shelters')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 nav-button ${
                currentView === 'shelters' ? 'active' : ''
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Shelters</span>
            </button>
            <button
              onClick={() => setCurrentView('dogs')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 nav-button ${
                currentView === 'dogs' ? 'active' : ''
              }`}
            >
              <Dog className="h-4 w-4" />
              <span>All Dogs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error message */}
        {error && <div className="mb-6 error-message px-4 py-3 rounded">{error}</div>}

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center mb-6">
            <div className="loading-spinner rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Main Views */}
        {currentView === 'shelters' && (
          <ShelterList
            shelters={shelters} // Pass shelters data
            onAddShelter={() => openShelterModal()}
            onEditShelter={openShelterModal}
            onDeleteShelter={deleteShelter}
            onAddDog={(shelter) => {
              setSelectedShelter(shelter);
              openDogModal();
            }}
            onEditDog={(shelter, dog) => {
              setSelectedShelter(shelter);
              openDogModal(dog);
            }}
            onDeleteDog={deleteDog}
          />
        )}

        {currentView === 'dogs' && (
          <DogList
            dogs={dogs}                 // Pass dogs data
            shelters={shelters}         // Pass shelters for reference
            selectedShelter={selectedShelter}
            onShelterSelect={setSelectedShelter}
            onAddDog={() => openDogModal()}
            onEditDog={(dog) => {
              const shelter = shelters.find(s => s.dogs && s.dogs.some(dogItem => dogItem.id === dog.id));
              setSelectedShelter(shelter);
              openDogModal(dog);
            }}
            onDeleteDog={(dog) => {
              const shelter = shelters.find(s => s.dogs && s.dogs.some(d => d.id === dog.id));
              if (shelter) deleteDog(dog.id, shelter.id);
            }}
          />
        )}
      </div>

      {/* Shelter Modal */}
      {showShelterModal && (
        <ShelterForm
          shelter={editingShelter}
          onSave={saveShelter}
          onCancel={() => {
            setShowShelterModal(false);
            setEditingShelter(null);
          }}
          loading={loading}
        />
      )}

      {/* Dog Modal */}
      {showDogModal && (
        <DogForm
          dog={editingDog}
          selectedShelter={selectedShelter}
          onSave={saveDog}
          onCancel={() => {
            setShowDogModal(false);
            setEditingDog(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default App;
