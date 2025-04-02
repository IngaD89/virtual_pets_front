import { useState, useEffect } from "react";
import { isAuthenticated, getToken } from "./Auth";
import { useNavigate } from "react-router-dom";
import "./CreatePetForm.css";

export default function CreatePetForm() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const characters = [
    { id: "KEVIN", name: "Kevin", imageUrl: "/kevin-transparent.png" },
    { id: "BOB", name: "Bob", imageUrl: "/bob.png" },
    { id: "STUART", name: "Stuart", imageUrl: "/stuart.png" }
  ];

  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedPet) {
      alert("Please choose your pet character.");
      return;
    }
    if (!petName) {
      alert("Please enter your pet's name.");
      return;
    }

    setIsSaving(true);
    const token = getToken();

    try {
      const response = await fetch("http://localhost:8080/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ petCharacter: selectedPet, name: petName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create pet");
      }

      alert("Pet saved successfully!");
      setPetName("");
      setSelectedPet(null);
      navigate("/");
    } catch (error) {
      alert("Error saving pet: " + error.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="create-pet-container">
      <h1 className="title">Choose your minion character</h1>
      <div className="character-selection">
        {characters.map((pet) => (
          <div
            key={pet.id}
            className={`character-item ${selectedPet === pet.id ? "selected" : ""}`}
            onClick={() => setSelectedPet(pet.id)}
          >
            <img src={pet.imageUrl} alt={pet.name} className="character-image" />
            <div className="character-name">{pet.name}</div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your minion name"
        value={petName}
        onChange={(e) => setPetName(e.target.value)}
        className="name-input"
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="save-button"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
