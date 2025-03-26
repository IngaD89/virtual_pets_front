// auth.js

// Función para obtener el token del localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Función para verificar si el token existe y no está expirado
export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decodificar el token JWT
    const expirationDate = decoded.exp * 1000; // Exp en segundos, se convierte a milisegundos
    return expirationDate < Date.now();
  } catch (e) {
    return true; // Si no se puede decodificar, considerarlo expirado
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
};

// Función para hacer solicitudes protegidas
export const fetchProtectedData = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('No estás autenticado');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers, // Permite agregar headers adicionales si es necesario
  };

  try {
    const response = await fetch(url, {
      method: options.method || 'GET', // Método por defecto es GET
      headers,
      body: options.body ? JSON.stringify(options.body) : null,
      credentials: 'include',  // Asegúrate de enviar las credenciales si las necesitas
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado, token expirado o inválido');
      }
      throw new Error(`Error al hacer la solicitud: ${response.statusText}`);
    }

    return response.json(); // Devuelve la respuesta como JSON
  } catch (error) {
    console.error("Error en la solicitud protegida:", error);
    throw new Error(`Error en la solicitud protegida: ${error.message}`);
  }
};
