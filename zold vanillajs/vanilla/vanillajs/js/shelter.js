const API_BASE = "http://localhost:8080/api";
const shelterList = document.getElementById('sheltersContainer');
const shelterForm = document.getElementById('addShelterForm');
const searchBar = document.getElementById('searchInput');

let shelters = [];

// ✅ Fetch all shelters
async function fetchShelters() {
    try {
        const response = await fetch(`${API_BASE}/shelter`);
        shelters = await response.json();
        renderShelters(shelters);
    } catch (error) {
        console.error("Error fetching shelters:", error);
    }
}

// ✅ Render shelters
function renderShelters(shelterArray) {
    shelterList.innerHTML = '';
    shelterArray.forEach(shelter => {
        const li = document.createElement('div');
        li.classList.add('card');
        li.innerHTML = `
            <h3>${shelter.name}</h3>
            <p>Location: ${shelter.location}</p>
            <button onclick="viewDogs(${shelter.id})">View Dogs</button>
            <button onclick="deleteShelter(${shelter.id})">Delete</button>
        `;
        shelterList.appendChild(li);
    });
}

// ✅ Add new shelter
shelterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('shelterName').value.trim();
    const location = document.getElementById('shelterLocation').value.trim();
    const email = document.getElementById('shelterEmail').value.trim();
    const phone = document.getElementById('shelterPhone').value.trim();

    if (!name || !location) return;

    try {
        const response = await fetch(`${API_BASE}/shelter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location, email, phone })
        });
        if (response.ok) {
            await fetchShelters();
            shelterForm.reset();
        }
    } catch (error) {
        console.error("Error adding shelter:", error);
    }
});

// ✅ Delete shelter
window.deleteShelter = async (id) => {
    if (!confirm('Are you sure you want to delete this shelter?')) return;
    try {
        const response = await fetch(`${API_BASE}/shelter/${id}`, { method: 'DELETE' });
        if (response.ok) fetchShelters();
    } catch (error) {
        console.error("Error deleting shelter:", error);
    }
};

// ✅ View dogs in shelter
window.viewDogs = (shelterId) => {
    window.location.href = `dogs.html?shelterId=${shelterId}`;
};

// ✅ Search shelters
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = shelters.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term)
    );
    renderShelters(filtered);
});

// Initial load
fetchShelters();
