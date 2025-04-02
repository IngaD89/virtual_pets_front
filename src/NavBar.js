import React from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate de React Router v6
import { isAuthenticated, logout } from './Auth'; // Importar las funciones de autenticación
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate(); // Usamos useNavigate

  const handleLogout = () => {
    // Llama a logout y redirige al login
    logout(); // Elimina el token
    navigate('/login'); // Redirige al login
  };

  const handleCreateMinion = () => {
    // Redirige a la página para crear un minion
    navigate('/create-pet');
  };

  const handleHome = () => {
    // Redirige a la página de inicio
    navigate('/');
  };

  return (
    <nav>
      <ul>
        <li>
          <button onClick={handleHome}>Home</button>
        </li>
        {isAuthenticated() ? (
          <>
            <li>
              <button onClick={handleCreateMinion}>Crear Minion</button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => navigate('/login')}>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
