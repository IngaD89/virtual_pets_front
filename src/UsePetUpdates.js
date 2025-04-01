import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const usePetUpdates = (petId, initialHappiness, initialHunger, initialEnergy) => {
  const [happiness, setHappiness] = useState(initialHappiness);
  const [hunger, setHunger] = useState(initialHunger);
  const [energy, setEnergy] = useState(initialEnergy);

  useEffect(() => {
    if (!petId) return;

    let subscription = null;

    const client = new Client({
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws/websocket'),
      onConnect: () => {
        console.log('Conectado a WebSocket');

        // Suscribirse a las actualizaciones generales de mascotas
        subscription = client.subscribe('/topic/petUpdates', (message) => {
          const updatedPets = JSON.parse(message.body);

          // Buscar la mascota específica por `petId`
          const updatedPet = updatedPets.find(pet => pet.id === petId);
          if (updatedPet) {
            setHappiness(updatedPet.happinessLevel);
            setHunger(updatedPet.hungerLevel);
            setEnergy(updatedPet.energyLevel);
          }
        });
      },
      onStompError: (error) => {
        console.error('Error en WebSocket:', error);
      }
    });

    client.activate();

    return () => {
      if (subscription) {
        subscription.unsubscribe(); // Desuscribirse correctamente
      }
      client.deactivate();
    };
  }, [petId]);

  return { happiness, hunger, energy };
};

export default usePetUpdates;
