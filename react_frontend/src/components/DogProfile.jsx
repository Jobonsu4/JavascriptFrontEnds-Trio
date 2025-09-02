import React from "react";

function DogProfile({ dog, onBack }) {
  return (
    <div className="card">
      <h2>{dog.name} 🐕</h2>
      <img src={dog.imageUrl || "https://placedog.net/400/300"} alt={dog.name} />
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p>Gender: {dog.gender}</p>
      <p>Description: {dog.description}</p>
      <button className="secondary-btn" onClick={onBack}>⬅ Back to Dogs</button>
    </div>
  );
}

export default DogProfile;
