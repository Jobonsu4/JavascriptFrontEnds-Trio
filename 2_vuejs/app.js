// Import createApp from Vue 3
const { createApp } = Vue;

// Create the Vue application
createApp({
  data() {
    return {
      view: 'main', // main, shelterList, shelterProfile, dogList, dogProfile, addShelter, addDog
      shelters: [],  // array of shelters from API
      dogs: [],      // array of dogs in current shelter
      currentShelter: null, // currently selected shelter
      currentDog: null,     // currently selected dog
      newShelter: { name: '', location: '', email: '', phoneNumber: '' },
      newDog: { name: '', breed: '', age: '', gender: '', description: '', shelterId: '', imageUrl: '' }
    };
  },
  methods: {
    // ------------------ MAIN MENU ------------------
    showMainMenu() {
      this.view = 'main';
    },

    // ------------------ SHELTER METHODS ------------------
    loadShelters() {
      fetch("http://localhost:8080/api/shelter")
        .then(res => res.json())
        .then(data => { this.shelters = data; this.view = 'shelterList'; })
        .catch(err => console.error(err));
    },

    viewShelter(id) {
      fetch(`http://localhost:8080/api/shelter/${id}`)
        .then(res => res.json())
        .then(data => {
          this.currentShelter = data;
          this.view = 'shelterProfile';
        })
        .catch(err => console.error(err));
    },

    addShelter() {
      fetch("http://localhost:8080/api/shelter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newShelter)
      })
      .then(res => res.json())
      .then(() => { 
        this.newShelter = { name: '', location: '', email: '', phoneNumber: '' }; 
        this.loadShelters(); 
      })
      .catch(err => console.error(err));
    },

    deleteShelter(id) {
      if (!confirm("Delete this shelter?")) return;
      fetch(`http://localhost:8080/api/shelter/${id}`, { method: "DELETE" })
        .then(() => this.loadShelters())
        .catch(err => console.error(err));
    },

    // ------------------ DOG METHODS ------------------
    loadDogs(shelterId) {
      fetch(`http://localhost:8080/api/shelter/${shelterId}`)
        .then(res => res.json())
        .then(data => {
          this.currentShelter = data;
          this.dogs = data.dogs;
          this.view = 'dogList';
        })
        .catch(err => console.error(err));
    },

    viewDog(dogId) {
      fetch(`http://localhost:8080/api/dog/${dogId}`)
        .then(res => res.json())
        .then(data => {
          this.currentDog = data;
          this.view = 'dogProfile';
        })
        .catch(err => console.error(err));
    },

    addDog() {
      const shelterId = this.newDog.shelterId;
      const payload = { ...this.newDog };
      delete payload.shelterId;

      fetch(`http://localhost:8080/api/dog/shelter/${shelterId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(() => { 
        this.newDog = { name: '', breed: '', age: '', gender: '', description: '', shelterId: '', imageUrl: '' };
        this.loadDogs(shelterId);
      })
      .catch(err => console.error(err));
    },

    deleteDog(id) {
      if (!confirm("Delete this dog?")) return;
      fetch(`http://localhost:8080/api/dog/${id}`, { method: "DELETE" })
        .then(() => this.loadDogs(this.currentShelter.id))
        .catch(err => console.error(err));
    }
  },
  template: `
    <!-- MAIN MENU -->
    <div v-if="view === 'main'">
      <h2>Welcome to Dog Shelter Management 🐾</h2>
      <button @click="loadShelters">View Shelters</button>
      <button @click="view = 'addShelter'">Add Shelter</button>
    </div>

    <!-- ADD SHELTER FORM -->
    <div v-if="view === 'addShelter'">
      <h2>Add Shelter</h2>
      <form @submit.prevent="addShelter">
        <input v-model="newShelter.name" placeholder="Shelter Name" required />
        <input v-model="newShelter.location" placeholder="Location" required />
        <input v-model="newShelter.email" placeholder="Email" required />
        <input v-model="newShelter.phoneNumber" placeholder="Phone Number" required />
        <button type="submit">Save Shelter</button>
      </form>
      <button @click="showMainMenu">⬅ Back</button>
    </div>

    <!-- SHELTER LIST -->
    <div v-if="view === 'shelterList'">
      <h2>All Shelters</h2>
      <ul>
        <li v-for="shelter in shelters" :key="shelter.id">
          <strong>{{ shelter.name }}</strong> - {{ shelter.location }}<br>
          Email: {{ shelter.email }}<br>
          Phone: {{ shelter.phoneNumber }}<br>
          <button @click="viewShelter(shelter.id)">View Details</button>
          <button @click="loadDogs(shelter.id)">View Dogs</button>
          <button @click="deleteShelter(shelter.id)">Delete</button>
        </li>
      </ul>
      <button @click="showMainMenu">⬅ Back</button>
    </div>

    <!-- SHELTER PROFILE -->
    <div v-if="view === 'shelterProfile'">
      <h2>{{ currentShelter.name }}</h2>
      <p>Location: {{ currentShelter.location }}</p>
      <p>Email: {{ currentShelter.email }}</p>
      <p>Phone: {{ currentShelter.phoneNumber }}</p>
      <p>Total Dogs: {{ currentShelter.dogs?.length || 0 }}</p>
      <button @click="loadShelters">⬅ Back to Shelters</button>
      <button @click="loadDogs(currentShelter.id)">View Dogs</button>
    </div>

    <!-- DOG LIST -->
    <div v-if="view === 'dogList'">
      <h2>Dogs in {{ currentShelter.name }}</h2>
      <ul>
        <li v-for="dog in dogs" :key="dog.id">
          {{ dog.name }} ({{ dog.breed }})
          <button @click="viewDog(dog.id)">View</button>
          <button @click="deleteDog(dog.id)">Delete</button>
        </li>
      </ul>

      <!-- ADD DOG FORM -->
      <h3>Add Dog</h3>
      <form @submit.prevent="addDog">
        <input v-model="newDog.name" placeholder="Dog Name" required />
        <input v-model="newDog.breed" placeholder="Breed" required />
        <input v-model="newDog.age" type="number" placeholder="Age" required />
        <input v-model="newDog.gender" placeholder="Gender" required />
        <input v-model="newDog.description" placeholder="Description" required />
        <input v-model="newDog.imageUrl" placeholder="Image URL" />
        <!-- bind current shelter id -->
        <input type="hidden" v-model="newDog.shelterId" :value="currentShelter.id" />
        <button type="submit">Save Dog</button>
      </form>

      <button @click="viewShelter(currentShelter.id)">⬅ Back to Shelter</button>
    </div>

    <!-- DOG PROFILE -->
    <div v-if="view === 'dogProfile'">
      <h2>{{ currentDog.name }} 🐕</h2>
      <p>Breed: {{ currentDog.breed }}</p>
      <p>Age: {{ currentDog.age }}</p>
      <p>Gender: {{ currentDog.gender }}</p>
      <p>Description: {{ currentDog.description }}</p>
      <button @click="loadDogs(currentDog.shelter.id)">⬅ Back to Dogs</button>
    </div>
  `
}).mount('#app');
