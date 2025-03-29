import { useState, useEffect } from "react";
import { isAuthenticated, getToken } from "./Auth"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import "./CreatePetForm.css";  // Asegúrate de que esta ruta sea correcta

export default function CreatePetForm() {
  const navigate = useNavigate(); // Inicializa el hook de navegación

  // Verificar si el usuario está autenticado al inicio
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login"); // Redirige al login si no está autenticado
    }
  }, [navigate]);

  // Definir los personajes de la mascota directamente en el frontend
  const characters = [
    { id: "KEVIN", name: "Kevin", imageUrl: "/kevin.jpg" },
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
    const token = getToken();  // Obtener el token de autenticación

    try {
      const response = await fetch("http://localhost:8080/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
        },
        body: JSON.stringify({ petCharacter: selectedPet, name: petName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create pet");
      }

      alert("Pet saved successfully!");
      setPetName("");
      setSelectedPet(null);
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
