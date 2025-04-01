import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const PetUpdates = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    let subscription = null;

    const client = new Client({
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws/websocket'), // Usar WebSocketFactory en lugar de brokerURL
      onConnect: () => {
        console.log('Conectado a WebSocket');

        // Suscribirse a las actualizaciones de mascotas
        subscription = client.subscribe('/topic/petUpdates', (message) => {
          const updatedPets = JSON.parse(message.body);
          setPets(updatedPets);
        });
      },
      onStompError: (error) => {
        console.error('Error en WebSocket:', error);
      }
    });

    client.activate();

    return () => {
      if (subscription) {
        subscription.unsubscribe(); // Desuscribirse antes de cerrar la conexión
      }
      client.deactivate();
    };
  }, []);

  return (
    <div>
      <h2>Actualizaciones de Mascotas</h2>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name} - Energía: {pet.energyLevel}</li>
        ))}
      </ul>
    </div>
  );
};

export default PetUpdates;
