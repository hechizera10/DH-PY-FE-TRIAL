import axiosConfig from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

export const authService = {
    // Registro de usuarios
    register: async (userData) => {
        try {
            const response = await axiosConfig.post("/api/auth/register", userData);
            return response.data;
        } catch (error) {
            console.error("Error en el registro de usuario:", error);
            throw error; // Reenvía el error para manejarlo en `handleSubmitUser`
        }
    },

    login: async (credentials) => {
        try {
            const response = await axiosConfig.post("/api/auth/login", credentials);
            const { token } = response.data;

            if (response.status === 200) {
                localStorage.setItem('token', token);
                const user = jwtDecode(token); // Decodifica el token para obtener los datos del usuario
                console.log("Token decodificado:", user);
                localStorage.setItem('loggedUser', JSON.stringify(user)); //Almacenamos tanto el usuario como el token en el mismo objeto
                return user;
            } else {
                setError(response.data.message || 'Email o contraseña incorrectos.');
            }

            
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error.response?.data?.message || "Error al iniciar sesión";
        }
    },
    
    // Obtener detalles de usuario (requiere token)
    // getUserDetails: async (token) => {
    //     try {
    //         const response = await axiosConfig.get("/usuario/detalles", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error al obtener detalles del usuario:", error);
    //     }
    // },
};
