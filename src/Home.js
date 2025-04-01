import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, fetchProtectedData, getToken } from "./Auth";
import './Home.css';
import { petImages } from './PetImages';

export default function Home() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  const checkUserRole = () => {
    const token = getToken();
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setDecodedToken(decoded);
      setIsAdmin(decoded.role === "admin");
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };

  const fetchPets = useCallback(async () => {
    if (!isAuthenticated()) {
      setError("No estás autenticado");
      navigate("/login");
      return;
    }

    if (!decodedToken) return;

    try {
      const data = await fetchProtectedData("http://localhost:8080/pets");
      if (data && data.length > 0) {
        setPets(isAdmin ? data : data.filter(pet => pet.owner === decodedToken.userId));
      } else {
        setPets([]);
      }
    } catch (error) {
      console.error("Error al cargar las mascotas", error);
      setError("Error al cargar las mascotas");
    }
  }, [decodedToken, isAdmin, navigate]);

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    if (decodedToken) {
      fetchPets();
    }
  }, [decodedToken, fetchPets]);

  const handleCreatePet = () => {
    navigate("/create-pet");
  };

  const handleViewPet = (petId) => {
    navigate(`/virtual-pet/${petId}`); // Solo redirige
  };

  const handleDeletePet = async (petId) => {
    try {
      const response = await fetch(`http://localhost:8080/pets/${petId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la mascota");
      }

      setPets((prevPets) => prevPets.filter(p => p.id !== petId));
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
      setError("No se pudo eliminar la mascota.");
    }
  };

  return (
    <div className="home-container">
      {error && <p className="error-message">{error}</p>}

      {pets.length === 0 ? (
        <div className="no-pets-container">
          <img
            src="/Users/test/IdeaProjects/virtual_pets_front/src/cueva_minions.jpg"
            alt="No pets"
            className="no-pets-image"
          />
          <h1 className="no-pets-title">You don’t have any pet yet</h1>
        </div>
      ) : (
        <div className="pets-container">
          <h1 className="pets-title">Your minions</h1>
          <div className="pets-list">
            {pets.map((pet) => {
              const petCharacter =
                pet.petCharacter.charAt(0).toUpperCase() + pet.petCharacter.slice(1).toLowerCase();
              const petType = pet.energy < 20 || pet.hunger < 20 ? "purple" : "yellow";
              const petImage = petImages[petCharacter]?.[petType] || "/default-image.png";

              return (
                <div key={pet.id} className="pet-card">
                  <img
                    src={petImage}
                    alt={pet.name}
                    className="w-32 h-32 object-cover mx-auto"
                  />
                  <p className="text-center mt-2 font-semibold">{pet.name}</p>
                  <div className="pet-card-buttons">
                    <button
                      onClick={() => handleViewPet(pet.id)}
                      className="view-button pet-card-button"
                    >
                      👁
                    </button>
                    <button className="edit-button pet-card-button"> ✏ </button>
                    <button
                      onClick={() => handleDeletePet(pet.id)}
                      className="delete-button pet-card-button"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleCreatePet}
        className="create-pet-button"
      >
        Create your minion
      </button>
    </div>
  );
}
