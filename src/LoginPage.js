import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    const apiUrl = 'http://localhost:8080/auth/login';

    const payload = {
      nickname,
      password
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Almacenar el token en localStorage o sessionStorage
        localStorage.setItem('authToken', data.token);
        alert('Inicio de sesión exitoso');
        // Redirigir al usuario a la página principal, si es necesario
         navigate("/home");
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      setError('Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="input-container">
          <label>Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Introduce tu nickname"
          />
        </div>

        <div className="input-container">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
          />
        </div>

        <button onClick={handleLogin}>Iniciar sesión</button>

        <div className="signup-text">
          <p>
            ¿Aún no tienes cuenta?{' '}
            <a href="/register" className="signup-link">Créalo aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
