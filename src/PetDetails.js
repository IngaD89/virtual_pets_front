import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isAuthenticated, getToken } from "./Auth";
//import { petImages } from "./PetImages";
import usePetUpdates from "./UsePetUpdates";
import ChangePetImages from "./ChangePetImages.js"
import "./PetDetails.css";

export default function PetDetails() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);

  // Obtener detalles iniciales de la mascota desde el backend
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

  // Hook para obtener actualizaciones en tiempo real
  const { happiness, hunger, energy } = usePetUpdates(
    petId,
    pet?.happinessLevel,
    pet?.hungerLevel,
    pet?.energyLevel
  );

  if (!pet) return <div>Cargando mascota...</div>;

  // Función para manejar la acción 'JUGAR'
  const handlePlay = async () => {
    if (!isAuthenticated()) {
      return;
    }

    try {
      const url = `http://localhost:8080/pets/${petId}/play`;
      const token = getToken();

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error al realizar la acción 'JUGAR':", error);
    }
  };

  // Función para manejar la acción 'ALIMENTAR'
  const handleFeed = async () => {
    if (!isAuthenticated()) {
      return;
    }

    try {
      const url = `http://localhost:8080/pets/${petId}/feed`;
      const token = getToken();

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error al realizar la acción 'ALIMENTAR':", error);
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
        <ChangePetImages petCharacter={pet.petCharacter} energy={energy} hunger={hunger} />
      </div>
      <div className="action-buttons">
        <button onClick={handlePlay} className="btn-play">JUGAR</button>
        <button onClick={handleFeed} className="btn-feed">ALIMENTAR</button>
      </div>
    </div>
  );
}
