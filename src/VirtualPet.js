import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isAuthenticated, getToken } from "./Auth";
import { petImages } from "./PetImages";
import usePetUpdates from "./UsePetUpdates";
import "./VirtualPet.css";

export default function VirtualPet() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);

  // Usamos el hook para obtener las actualizaciones en tiempo real
  const { happiness, hunger, energy } = usePetUpdates(petId, 100, 100, 100);

  useEffect(() => {
    if (!petId || !isAuthenticated()) return;

    const token = getToken();

    fetch(`http://localhost:8080/pets/${petId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.petCharacter) {
          setPet(data);
        } else {
          console.error("La respuesta no contiene petCharacter:", data);
        }
      })
      .catch((error) => console.error("Error fetching pet:", error));
  }, [petId]);

  const petCharacter = pet ? pet.petCharacter.charAt(0).toUpperCase() + pet.petCharacter.slice(1).toLowerCase() : "";
  const petType = energy < 20 || hunger < 20 ? "purple" : "yellow";
  const petImage = petImages[petCharacter]?.[petType] || "oops-transparent.png";

  // Función para manejar la acción 'JUGAR'
  const handlePlay = async () => {
    if (!isAuthenticated()) {
      alert("No estás autenticado. Inicia sesión para realizar esta acción.");
      return;
    }

    try {
      const url = `http://localhost:8080/pets/${petId}/play`;
      const token = getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Acción 'JUGAR' realizada con éxito.");
      }
    } catch (error) {
      console.error("Error al realizar la acción 'JUGAR':", error);
      alert("No se pudo realizar la acción 'JUGAR'.");
    }
  };

  // Función para manejar la acción 'ALIMENTAR'
  const handleFeed = async () => {
    if (!isAuthenticated()) {
      alert("No estás autenticado. Inicia sesión para realizar esta acción.");
      return;
    }

    try {
      const url = `http://localhost:8080/pets/${petId}/feed`;
      const token = getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Acción 'ALIMENTAR' realizada con éxito.");
      }
    } catch (error) {
      console.error("Error al realizar la acción 'ALIMENTAR':", error);
      alert("No se pudo realizar la acción 'ALIMENTAR'.");
    }
  };

  return (
    <div className="virtual-pet-container">
      <h1>{pet?.name}</h1>
      <div className="status-bar">
        <div className="status-item-container">
          <div className="status-item-label">😊 Felicidad</div>
          <div className="status-item">
            <div className="status-fill status-happiness" style={{ width: `${happiness}%` }}></div>
          </div>
        </div>
        <div className="status-item-container">
          <div className="status-item-label">🍌 Hambre</div>
          <div className="status-item">
            <div className="status-fill status-hunger" style={{ width: `${hunger}%` }}></div>
          </div>
        </div>
        <div className="status-item-container">
          <div className="status-item-label">🧪 Energía</div>
          <div className="status-item">
            <div className="status-fill status-energy" style={{ width: `${energy}%` }}></div>
          </div>
        </div>
      </div>
      <div className="pet-image">
        <img src={petImage} alt={petCharacter} className="character-img" />
      </div>
      <div className="action-buttons">
        <button onClick={handlePlay} className="btn-play">JUGAR</button>
        <button onClick={handleFeed} className="btn-feed">ALIMENTAR</button>
      </div>
    </div>
  );
}
