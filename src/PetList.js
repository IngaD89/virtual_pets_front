import React from "react";

export default function PetList({ pets }) {
  return (
    <div className="text-white text-xl">
      <h2>Your Pets</h2>
      <ul>
        {pets.map(pet => (
          <li key={pet.id} className="mt-2 bg-black bg-opacity-50 p-4 rounded-lg">
            {pet.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
