import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Home from './Home.js';
import CreatePetForm from './CreatePetForm.js';
import VirtualPet from './VirtualPet.js';

function App() {
  return (
    <Router> {/* Envolvemos la app con BrowserRouter */}
      <Routes> {/* Definimos las rutas */}
        <Route path="/login" element={<LoginPage />} /> {/* Ruta para el login */}
        <Route path="/register" element={<RegisterPage />} /> {/* Ruta para el registro de usuario */}
        <Route path="/home" element={<Home />} /> {/* Ruta para el home */}
        <Route path="/create-pet" element={<CreatePetForm />} /> {/* Ruta para el form de crear pet */}
        <Route path="/virtual-pet/:petId" element={<VirtualPet />} /> {/* Ruta para el form de crear pet */}
        <Route path="/virtual-pet/:petId/play" element={<VirtualPet action="play" />} /> {/* Acción de jugar */}
        <Route path="/virtual-pet/:petId/feed" element={<VirtualPet action="feed" />} /> {/* Acción de alimentar */}
      </Routes>
    </Router>
  );
}

export default App;
