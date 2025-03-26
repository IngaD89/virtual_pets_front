import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, fetchProtectedData, getToken } from "./Auth";
import './Home.css';  // Importa el archivo CSS

export default function Home() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null); // Estado para almacenar el decodedToken

  // Obtener rol del usuario desde el token
  const checkUserRole = () => {
    const token = getToken();
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
      setDecodedToken(decoded); // Guardar el decodedToken en el estado
      setIsAdmin(decoded.role === "admin");
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };

  const fetchPets = useCallback(async () => { // Usa useCallback para memorizar la función
     if (!isAuthenticated()) {
       setError("No estás autenticado");
       navigate("/login");
       return;
     }

     if (!decodedToken) return; // Asegurarse de que decodedToken esté disponible


  try {
    const data = await fetchProtectedData("http://localhost:8080/pets");

    // Verificar si la respuesta contiene datos
    if (data && data.length > 0) {
      setPets(isAdmin ? data : data.filter(pet => pet.owner === decodedToken.userId));
    } else {
      setPets([]);
    }
  } catch (error) {
    console.error("Error al cargar las mascotas", error);
    setError("Error al cargar las mascotas");
  }
}, [decodedToken, isAdmin, navigate]); // Se agregan las dependencias de decodedToken, isAdmin, y navigate

   // Efecto al cargar la página para obtener el rol del usuario
   useEffect(() => {
     checkUserRole();
   }, []); // Solo llamamos checkUserRole cuando se monta el componente

   // Efecto al cambiar decodedToken
   useEffect(() => {
     if (decodedToken) {
       fetchPets(); // Llamar a fetchPets solo después de obtener decodedToken
     }
   }, [decodedToken, fetchPets]); // Ahora 'fetchPets' es una dependencia memorizada

   // Redirigir a la creación de mascotas
   const handleCreatePet = () => {
     navigate("/create-pet");
   };

  return (
    <div className="home-container">
      {error && <p className="error-message">{error}</p>}

      {pets.length === 0 ? (
        <div className="no-pets-container">
          <img
            src="/Users/test/IdeaProjects/virtual_pets_front/src/cueva_minions.jpg" // Asegúrate de que la ruta sea correcta
            alt="No pets"
            className="no-pets-image"
          />
          <h1 className="no-pets-title">
            You don’t have any pet yet
          </h1>
          <button
            onClick={handleCreatePet}
            className="create-pet-button"
          >
            Create your minion
          </button>
        </div>
      ) : (
        <div className="pets-container">
          <h1 className="pets-title">
            Your minions
          </h1>
          <div className="pets-list">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-32 h-32 object-cover mx-auto"
                />
                <p className="pet-card-name">{pet.name}</p>
                <div className="pet-card-buttons">
                  <button className="view-button pet-card-button">👁 View</button>
                  <button className="edit-button pet-card-button">✏ Edit</button>
                  <button className="delete-button pet-card-button">🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
