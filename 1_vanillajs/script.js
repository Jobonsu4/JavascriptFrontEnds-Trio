const contentDiv = document.getElementById("content");

// ------------------ MAIN MENU ------------------
function showMainMenu() {
    console.log("Displaying Main Menu");
    contentDiv.innerHTML = `
        <h2>Welcome to Dog Shelter Management 🐾</h2>
        <div class="menu">
            <button onclick="loadShelters()">View Shelters</button>
            <button onclick="loadDogs()">View Dogs</button>
            <button onclick="showAddShelterForm()">➕ Add Shelter</button>
            <button onclick="showAddDogForm()">➕ Add Dog</button>
        </div>
    `;
}

// ------------------ READ ------------------
function loadShelters() {
    console.log("Fetching all shelters...");
    fetch("http://localhost:8080/api/shelter")
        .then(res => {
            console.log("Shelters fetch response:", res);
            return res.json();
        })
        .then(shelters => {
            console.log("Shelters data received:", shelters);
            contentDiv.innerHTML = "<h2>All Shelters</h2>";
            shelters.forEach(shelter => {
                const shelterCard = document.createElement("div");
                shelterCard.className = "card";
                shelterCard.innerHTML = `
                    <h3>${shelter.name}</h3>
                    <p><strong>Location:</strong> ${shelter.location}</p>
                    <p><strong>Email:</strong> ${shelter.email || "N/A"}</p>
                    <p><strong>Phone:</strong> ${shelter.phoneNumber || "N/A"}</p>
                    <button onclick="loadShelterDogs(${shelter.id})">View Dogs</button>
                    <button onclick="showEditShelterForm(${shelter.id})">✏ Edit</button>
                    <button onclick="deleteShelter(${shelter.id})">🗑 Delete</button>
                `;
                contentDiv.appendChild(shelterCard);
            });

            const backBtn = document.createElement("button");
            backBtn.textContent = "⬅ Back to Main Menu";
            backBtn.onclick = showMainMenu;
            contentDiv.appendChild(backBtn);
        })
        .catch(err => console.error("Error loading shelters:", err));
}

function loadShelterDogs(shelterId) {
    console.log(`Fetching shelter ${shelterId}...`);
    fetch(`http://localhost:8080/api/shelter/${shelterId}`)
        .then(res => res.json())
        .then(shelter => {
            console.log("Single shelter data:", shelter);
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
                    const dogCard = document.createElement("div");
                    dogCard.className = "card";
                    const imageUrl = dog.imageUrl || `https://place-puppy.com/200x200?random=${dog.id}`;
                    dogCard.innerHTML = `
                        <h4>${dog.name}</h4>
                        <img src="${imageUrl}" alt="${dog.name}" class="dog-photo">
                        <p><strong>Breed:</strong> ${dog.breed}</p>
                        <p><strong>Age:</strong> ${dog.age}</p>
                        <p><strong>Gender:</strong> ${dog.gender}</p>
                        <button onclick="viewDog(${dog.id}, ${shelter.id})">View Profile</button>
                        <button onclick="showEditDogForm(${dog.id})">✏ Edit</button>
                        <button onclick="deleteDog(${dog.id})">🗑 Delete</button>
                    `;
                    dogsListDiv.appendChild(dogCard);
                });
            } else {
                dogsListDiv.innerHTML = "<p>No dogs in this shelter yet.</p>";
                console.log("No dogs found in this shelter.");
            }
        })
        .catch(err => console.error("Error loading shelter dogs:", err));
}

function loadDogs() {
    console.log("Fetching all dogs...");
    fetch("http://localhost:8080/api/dog")
        .then(res => res.json())
        .then(dogs => {
            console.log("Dogs data received:", dogs);
            contentDiv.innerHTML = "<h2>All Dogs</h2>";
            dogs.forEach(dog => {
                const dogCard = document.createElement("div");
                dogCard.className = "card";
                const imageUrl = dog.imageUrl || `https://place-puppy.com/200x200?random=${dog.id}`;
                dogCard.innerHTML = `
                    <h3>${dog.name}</h3>
                    <img src="${imageUrl}" alt="${dog.name}" class="dog-photo">
                    <p><strong>Breed:</strong> ${dog.breed}</p>
                    <p><strong>Age:</strong> ${dog.age}</p>
                    <p><strong>Gender:</strong> ${dog.gender}</p>
                    <p><em>Shelter:</em> ${dog.shelter ? dog.shelter.name : "Unknown"}</p>
                    <button onclick="viewDog(${dog.id}, ${dog.shelter ? dog.shelter.id : null})">View Profile</button>
                    <button onclick="showEditDogForm(${dog.id})">✏ Edit</button>
                    <button onclick="deleteDog(${dog.id})">🗑 Delete</button>
                `;
                contentDiv.appendChild(dogCard);
            });

            const backBtn = document.createElement("button");
            backBtn.textContent = "⬅ Back to Main Menu";
            backBtn.onclick = showMainMenu;
            contentDiv.appendChild(backBtn);
        })
        .catch(err => console.error("Error loading dogs:", err));
}

// ------------------ CREATE ------------------
function showAddShelterForm() {
    contentDiv.innerHTML = `
        <h2>Add New Shelter</h2>
        <form id="shelterForm">
            <input type="text" name="name" placeholder="Shelter Name" required>
            <input type="text" name="location" placeholder="Location" required>
            <input type="email" name="email" placeholder="Email">
            <input type="text" name="phoneNumber" placeholder="Phone Number">
            <button type="submit">Save Shelter</button>
        </form>
        <button onclick="showMainMenu()">⬅ Back</button>
    `;

    document.getElementById("shelterForm").onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log("Creating shelter:", data);

        fetch("http://localhost:8080/api/shelter", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            console.log("Shelter created:", result);
            loadShelters();
        })
        .catch(err => console.error("Error creating shelter:", err));
    };
}

function showAddDogForm() {
    contentDiv.innerHTML = `
        <h2>Add New Dog</h2>
        <form id="dogForm">
            <input type="text" name="name" placeholder="Dog Name" required>
            <input type="text" name="breed" placeholder="Breed" required>
            <input type="number" name="age" placeholder="Age" required>
            <input type="text" name="gender" placeholder="Gender" required>
            <input type="text" name="description" placeholder="Description">
            <input type="number" name="shelterId" placeholder="Shelter ID" required>
            <input type="url" name="imageUrl" placeholder="Image URL">
            <button type="submit">Save Dog</button>
        </form>
        <button onclick="showMainMenu()">⬅ Back</button>
    `;

    document.getElementById("dogForm").onsubmit = function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log("Creating dog:", data);

        const shelterId = data.shelterId; // get the shelter ID
        delete data.shelterId;            // remove it from the request body

        fetch(`http://localhost:8080/api/dog/shelter/${shelterId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(res => {
            console.log("Create Dog response:", res);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(result => {
            console.log("Dog created:", result);
            loadDogs();
        })
        .catch(err => console.error("Error creating dog:", err));
    };
}

// ------------------ UPDATE ------------------
function showEditShelterForm(shelterId) {
    fetch(`http://localhost:8080/api/shelter/${shelterId}`)
        .then(res => res.json())
        .then(shelter => {
            console.log("Editing shelter:", shelter);
            contentDiv.innerHTML = `
                <h2>Edit Shelter</h2>
                <form id="editShelterForm">
                    <input type="text" name="name" value="${shelter.name}" required>
                    <input type="text" name="location" value="${shelter.location}" required>
                    <input type="email" name="email" value="${shelter.email || ""}">
                    <input type="text" name="phoneNumber" value="${shelter.phoneNumber || ""}">
                    <button type="submit">Update Shelter</button>
                </form>
                <button onclick="loadShelters()">⬅ Back</button>
            `;

            document.getElementById("editShelterForm").onsubmit = (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                console.log("Updating shelter:", data);

                fetch(`http://localhost:8080/api/shelter/${shelterId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(result => {
                    console.log("Shelter updated:", result);
                    loadShelters();
                })
                .catch(err => console.error("Error updating shelter:", err));
            };
        });
}

function showEditDogForm(dogId) {
    fetch(`http://localhost:8080/api/dog/${dogId}`)
        .then(res => res.json())
        .then(dog => {
            console.log("Editing dog:", dog);
            contentDiv.innerHTML = `
                <h2>Edit Dog</h2>
                <form id="editDogForm">
                    <input type="text" name="name" value="${dog.name}" required>
                    <input type="text" name="breed" value="${dog.breed}" required>
                    <input type="number" name="age" value="${dog.age}" required>
                    <input type="text" name="gender" value="${dog.gender}" required>
                    <input type="text" name="description" value="${dog.description || ""}">
                    <input type="number" name="shelterId" value="${dog.shelter ? dog.shelter.id : ""}">
                    <input type="url" name="imageUrl" value="${dog.imageUrl || ""}">
                    <button type="submit">Update Dog</button>
                </form>
                <button onclick="loadDogs()">⬅ Back</button>
            `;

            document.getElementById("editDogForm").onsubmit = (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                console.log("Updating dog:", data);

                fetch(`http://localhost:8080/api/dog/${dogId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(result => {
                    console.log("Dog updated:", result);
                    loadDogs();
                })
                .catch(err => console.error("Error updating dog:", err));
            };
        });
}

// ------------------ DELETE ------------------
function deleteShelter(shelterId) {
    console.log("Deleting shelter:", shelterId);
    if (!confirm("Are you sure you want to delete this shelter?")) return;

    fetch(`http://localhost:8080/api/shelter/${shelterId}`, { method: "DELETE" })
        .then(res => {
            console.log("Delete shelter response:", res.status);
            loadShelters();
        })
        .catch(err => console.error("Error deleting shelter:", err));
}

function deleteDog(dogId) {
    console.log("Deleting dog:", dogId);
    if (!confirm("Are you sure you want to delete this dog?")) return;

    fetch(`http://localhost:8080/api/dog/${dogId}`, { method: "DELETE" })
        .then(res => {
            console.log("Delete dog response:", res.status);
            loadDogs();
        })
        .catch(err => console.error("Error deleting dog:", err));
}

// ------------------ DOG PROFILE ------------------
function viewDog(dogId, shelterId = null) {
    console.log(`Fetching dog ${dogId}...`);
    fetch(`http://localhost:8080/api/dog/${dogId}`)
        .then(res => res.json())
        .then(dog => {
            console.log("Dog data received:", dog);
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
                <button onclick="showMainMenu()">⬅ Back to Main Menu</button>
            `;
        })
        .catch(err => console.error("Error loading dog profile:", err));
}


// ------------------ START ------------------
console.log("Starting Dog Shelter frontend...");
showMainMenu();
