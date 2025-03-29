import React, { useState, useEffect } from "react";
import { isAuthenticated, fetchProtectedData } from "./Auth"; // Asegúrate de que la ruta es correcta

export default function VirtualPet({ character, petId }) {
  const [happiness, setHappiness] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [energy, setEnergy] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prev) => Math.max(0, prev - 5));
      setEnergy((prev) => Math.min(100, prev + 5));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value > 70) return "bg-green-500";
    if (value > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleAction = async (action) => {
    if (!isAuthenticated()) {
      alert("No estás autenticado. Inicia sesión para realizar esta acción.");
      return;
    }

    try {
      const response = await fetchProtectedData(`/pets/${petId}?action=${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.ok) {
        if (action === "play") {
          setHappiness((prev) => Math.min(100, prev + 20));
          setEnergy((prev) => Math.max(0, prev - 10));
        } else if (action === "feed") {
          setHunger((prev) => Math.min(100, prev + 20));
          setEnergy((prev) => Math.min(100, prev + 10));
        }
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alert(`Error al realizar la acción ${action}.`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center mt-10">
      {/* Header con barras de estado */}
      <header className="mb-4">
        {[
          { label: "😊 Felicidad", value: happiness },
          { label: "🍲 Hambre", value: hunger },
          { label: "⚡ Energía", value: energy },
        ].map((status, index) => (
          <div key={index} className="mb-3">
            <div className="text-sm font-semibold text-gray-700 mb-1">{status.label}</div>
            <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden">
              <div className={`h-full ${getColor(status.value)} transition-all duration-500`} style={{ width: `${status.value}%` }}></div>
            </div>
          </div>
        ))}
      </header>

      {/* Imagen de la mascota */}
      <div className="mb-6">
        <img src={`/${character}.png`} alt={character} className="mx-auto w-40 h-40 object-cover" />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleAction("play")}
          className="w-32 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          JUGAR
        </button>
        <button
          onClick={() => handleAction("feed")}
          className="w-32 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
        >
          ALIMENTAR
        </button>
      </div>
    </div>
  );
}
