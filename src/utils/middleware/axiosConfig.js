// src/utils/axiosMiddleware.js
import axios from 'axios';
import { useContextGlobal } from '../global.context';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/', // Cambia esto a tu URL de backend
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
    (config) => {
        const { state } = useContextGlobal();
        const token = state.loggedUser?.token; // Asegúrate de que el token esté en el estado
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejo de errores global
        console.error('Error en la respuesta:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;