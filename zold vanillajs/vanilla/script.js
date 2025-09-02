const contentDiv = document.getElementById("content");

// ✅ Main Menu
function showMainMenu() {
    contentDiv.innerHTML = `
        <h2>Welcome to Dog Shelter Management 🐾</h2>
        <div class="menu">
            <button onclick="loadShelters()">View Shelters</button>
            <button onclick="loadDogs()">View Dogs</button>
        </div>
    `;
}

// ✅ Fetch all shelters
async function loadShelters() {
    const res = await fetch("/api/shelter");
    const shelters = await res.json();

    contentDiv.innerHTML = "<h2>All Shelters</h2>";

    shelters.forEach(shelter => {
        const shelterCard = document.createElement("div");
        shelterCard.className = "card";
        shelterCard.innerHTML = `
            <h3>${shelter.name}</h3>
            <p><strong>Location:</strong> ${shelter.location}</p>
            <p><strong>Email:</strong> ${shelter.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${shelter.phoneNumber || "N/A"}</p>
            <button class="details-btn" onclick="loadShelterDogs(${shelter.id})">View Dogs</button>
        `;
        contentDiv.appendChild(shelterCard);
    });

    // Back button
    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅ Back to Main Menu";
    backBtn.onclick = showMainMenu;
    contentDiv.appendChild(backBtn);
}

// ✅ Fetch single shelter & show dogs
async function loadShelterDogs(shelterId) {
    const res = await fetch(`/api/shelter/${shelterId}`);
    const shelter = await res.json();

    contentDiv.innerHTML = `
        <h2>Dogs in ${shelter.name}</h2>
        <p><strong>Location:</strong> ${shelter.location}</p>
        <p><strong>Email:</strong> ${shelter.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${shelter.phoneNumber || "N/A"}</p>
        <button onclick="loadShelters()">⬅ Back to Shelters</button>
        <div id="dogsList"></div>
    `;

    const dogsListDiv = document.getElementById("dogsList");

    if (shelter.dogs && shelter.dogs.length > 0) {
        shelter.dogs.forEach(dog => {
            const imageUrl = dog.imageUrl || `https://place-puppy.com/200x200?random=${dog.id}`;
            const dogCard = document.createElement("div");
            dogCard.className = "card";
            dogCard.innerHTML = `
                <h4>${dog.name}</h4>
                <img src="${imageUrl}" alt="${dog.name}" class="dog-photo">
                <p><strong>Breed:</strong> ${dog.breed}</p>
                <p><strong>Age:</strong> ${dog.age}</p>
                <p><strong>Gender:</strong> ${dog.gender}</p>
                <button onclick="viewDog(${dog.id}, ${shelter.id})">View Profile</button>
            `;
            dogsListDiv.appendChild(dogCard);
        });
    } else {
        dogsListDiv.innerHTML = "<p>No dogs in this shelter yet.</p>";
    }
}

// ✅ Fetch all dogs
async function loadDogs() {
    const res = await fetch("/api/dog");
    const dogs = await res.json();

    contentDiv.innerHTML = "<h2>All Dogs</h2>";

    dogs.forEach(dog => {
        const imageUrl = dog.imageUrl || `https://place-puppy.com/200x200?random=${dog.id}`;
        const dogCard = document.createElement("div");
        dogCard.className = "card";
        dogCard.innerHTML = `
            <h3>${dog.name}</h3>
            <img src="${imageUrl}" alt="${dog.name}" class="dog-photo">
            <p><strong>Breed:</strong> ${dog.breed}</p>
            <p><strong>Age:</strong> ${dog.age}</p>
            <p><strong>Gender:</strong> ${dog.gender}</p>
            <p><em>Shelter:</em> ${dog.shelter ? dog.shelter.name : "Unknown"}</p>
            <button onclick="viewDog(${dog.id}, ${dog.shelter ? dog.shelter.id : null})">View Profile</button>
        `;
        contentDiv.appendChild(dogCard);
    });

    // Back button
    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅ Back to Main Menu";
    backBtn.onclick = showMainMenu;
    contentDiv.appendChild(backBtn);
}

// ✅ Dog Profile Page
async function viewDog(dogId, shelterId = null) {
    const res = await fetch(`/api/dog/${dogId}`);
    const dog = await res.json();

    const imageUrl = dog.imageUrl || `https://place-puppy.com/300x300?random=${dog.id}`;

    contentDiv.innerHTML = `
        <h2>${dog.name} 🐕</h2>
        <div class="card dog-profile">
            <img src="${imageUrl}" alt="${dog.name}" class="dog-photo">
            <p><strong>Breed:</strong> ${dog.breed}</p>
            <p><strong>Age:</strong> ${dog.age}</p>
            <p><strong>Gender:</strong> ${dog.gender}</p>
            <p><strong>Description:</strong> ${dog.description || "N/A"}</p>
            <p><strong>Shelter:</strong> ${dog.shelter ? dog.shelter.name : "Unknown"}</p>
        </div>
    `;

    // Back buttons
    const backDiv = document.createElement("div");
    backDiv.className = "menu";

    if (shelterId) {
        const backToShelterBtn = document.createElement("button");
        backToShelterBtn.textContent = "⬅ Back to Shelter";
        backToShelterBtn.onclick = () => loadShelterDogs(shelterId);
        backDiv.appendChild(backToShelterBtn);
    }

    const backToDogsBtn = document.createElement("button");
    backToDogsBtn.textContent = "⬅ Back to All Dogs";
    backToDogsBtn.onclick = loadDogs;
    backDiv.appendChild(backToDogsBtn);

    const backToMenuBtn = document.createElement("button");
    backToMenuBtn.textContent = "⬅ Back to Main Menu";
    backToMenuBtn.onclick = showMainMenu;
    backDiv.appendChild(backToMenuBtn);

    contentDiv.appendChild(backDiv);
}

// ✅ Load main menu on startup
showMainMenu();
