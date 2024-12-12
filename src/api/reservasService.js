import axiosConfig from './axiosConfig';

const reservasService = {
    // Crear una nueva reserva
    crearReserva: async (obraId, fechaInicio, fechaFin) => {
        try {
            const response = await axiosConfig.post('/reservas', {
                obra: obraId,
                fechaInicio: fechaInicio.toISOString().split('T')[0],
                fechaFin: fechaFin.toISOString().split('T')[0]
            }, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Verificar disponibilidad de fechas para una obra específica
    verificarDisponibilidad: async (obraId, fechaInicio, fechaFin) => {
        try {
            const response = await axiosConfig.get(`/reservas/${obraId}/rango-no-disponible`, {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener obras disponibles en un rango de fechas
    obtenerObrasDisponibles: async (fechaInicio, fechaFin) => {
        try {
            const response = await axiosConfig.get('/reservas/disponibles', {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener reservas por usuario
    obtenerReservasPorUsuario: async (userId) => {
        try {
            const response = await axiosConfig.get(`/usuarios/reservaciones`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default reservasService; 