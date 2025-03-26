import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !nickname || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nickname, password }),
      });

      if (response.ok) {
        alert("Registro exitoso");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Ocurrió un error en el registro");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Registro</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="input-container">
          <label>Email</label>
          <input
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <label>Nickname</label>
          <input
            type="text"
            placeholder="Introduce tu nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="input-container">
          <label>Password</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRegister}>Registrarse</button>

        <div className="signup-text">
          <p>
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="signup-link">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}
