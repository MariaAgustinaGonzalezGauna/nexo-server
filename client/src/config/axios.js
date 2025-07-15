import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // URL completa al servidor
    timeout: 10000, // aumentamos el timeout a 10 segundos
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('Error de conexión:', error.request);
        } else {
            // Algo sucedió al configurar la petición
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;