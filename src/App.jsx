import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Home from './Home.js';
import CreatePetForm from './CreatePetForm.js';
import PetDetails from './PetDetails.js';
import NavBar from './NavBar';

function AppContent() {
  const location = useLocation(); // Obtiene la ruta actual
  const hideNavBar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Muestra el NavBar solo si NO estás en login o register */}
      {!hideNavBar && <NavBar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-pet" element={<CreatePetForm />} />
        <Route path="/pet-details/:petId" element={<PetDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
