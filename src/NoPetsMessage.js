import React from "react";

export default function NoPetsMessage({ onCreatePet }) {
  return (
    <div className="text-white text-xl bg-black bg-opacity-50 p-4 rounded-lg">
      You don’t have any pet yet
      <button
        onClick={onCreatePet}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Create your pet
      </button>
    </div>
  );
}
