const contentDiv = document.getElementById("content");

// ✅ Add New Shelter Form
function showCreateShelterForm() {
    contentDiv.innerHTML = `
        <h2>Add New Shelter</h2>
        <form id="create-shelter-form">
            <input type="text" id="name" placeholder="Shelter Name" required><br>
            <input type="text" id="location" placeholder="Location" required><br>
            <input type="email" id="email" placeholder="Email"><br>
            <input type="text" id="phone" placeholder="Phone Number"><br>
            <button type="submit">Add Shelter</button>
        </form>
        <button onclick="loadShelters()">⬅ Back to Shelters</button>
    `;

    document.getElementById("create-shelter-form").onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById("name").value,
            location: document.getElementById("location").value,
            email: document.getElementById("email").value,
            phoneNumber: document.getElementById("phone").value
        };

        await fetch(`${API_BASE_URL}/shelter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        loadShelters();
    };
}

// ✅ Delete Shelter
async function deleteShelter(shelterId) {
    if (confirm("Are you sure you want to delete this shelter?")) {
        await fetch(`${API_BASE_URL}/shelter/${shelterId}`, {
            method: "DELETE"
        });
        loadShelters();
    }
}

// ✅ Update Shelter Form
async function showUpdateShelterForm(shelterId) {
    const res = await fetch(`${API_BASE_URL}/shelter/${shelterId}`);
    const shelter = await res.json();

    contentDiv.innerHTML = `
        <h2>Edit Shelter</h2>
        <form id="update-shelter-form">
            <input type="text" id="name" value="${shelter.name}" required><br>
            <input type="text" id="location" value="${shelter.location}" required><br>
            <input type="email" id="email" value="${shelter.email || ""}"><br>
            <input type="text" id="phone" value="${shelter.phoneNumber || ""}"><br>
            <button type="submit">Update Shelter</button>
        </form>
        <button onclick="loadShelters()">⬅ Back to Shelters</button>
    `;

    document.getElementById("update-shelter-form").onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById("name").value,
            location: document.getElementById("location").value,
            email: document.getElementById("email").value,
            phoneNumber: document.getElementById("phone").value
        };

        await fetch(`${API_BASE_URL}/shelter/${shelterId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        loadShelters();
    };
}

// ✅ Modify loadShelters() to include CRUD buttons
async function loadShelters() {
    const res = await fetch(`${API_BASE_URL}/shelter`);
    const shelters = await res.json();

    contentDiv.innerHTML = `
        <h2>All Shelters</h2>
        <button onclick="showCreateShelterForm()">➕ Add Shelter</button>
    `;

    shelters.forEach(shelter => {
        const shelterCard = document.createElement("div");
        shelterCard.className = "card";
        shelterCard.innerHTML = `
            <h3>${shelter.name}</h3>
            <p><strong>Location:</strong> ${shelter.location}</p>
            <p><strong>Email:</strong> ${shelter.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${shelter.phoneNumber || "N/A"}</p>
            <button onclick="loadShelterDogs(${shelter.id})">View Dogs</button>
            <button onclick="showUpdateShelterForm(${shelter.id})">✏ Edit</button>
            <button onclick="deleteShelter(${shelter.id})" style="color:red;">🗑 Delete</button>
        `;
        contentDiv.appendChild(shelterCard);
    });

    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅ Back to Main Menu";
    backBtn.onclick = showMainMenu;
    contentDiv.appendChild(backBtn);
}
