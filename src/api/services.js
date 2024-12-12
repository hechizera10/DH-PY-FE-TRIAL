import axiosConfig from "./axiosConfig";

export const obrasService = {
    getObras: async () => {
        try {
            const response = await axiosConfig.get("/obra/listartodos");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getObra: async (id) => {
        try {
            const response = await axiosConfig.get(`/obra/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener al usuario: ", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
            throw error;
        }
    },

    createObra: async (obra, files) => {  
        try {
            const formData = new FormData();

            // Agrega los datos de la obra al FormData
            Object.keys(obra).forEach(key => {
                formData.append(key, obra[key]);
            });
            
            files.forEach(file => {formData.append("files", file)});
            
            const response = await axiosConfig.post("/obra", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("Response:", response);
            return response.data;
        } catch (error) {
            console.error("Error guardando la obra con imágenes:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
            throw error;
        }
    },

    updateObra: async (formData) => {
        try {
            const response = await axiosConfig.put("/obra", formData, {
                headers: {
                    //"Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error actualizando la obra con imágenes:", error);
            if (error.response) {
                throw new Error(error.response.data || "Error desconocido al actualizar la obra.");
            } else {
            throw new Error("No se pudo actualizar la obra. Por favor, verifica tu conexión o intenta nuevamente.");
            }
        }
    },

    deleteObra: async (id) => {
        try {
            const response = await axiosConfig.delete(`/obra/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error en deleteObra:", error);
            throw new Error("No se pudo eliminar la obra. Por favor, verifica tu conexión o intenta nuevamente.");
        }
    },
};

