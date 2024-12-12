import axiosConfig from "./axiosConfig";

export const userService = {

    getUsers: async () => {
        try {
            const response = await axiosConfig.get("/usuarios/listartodos", {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            return response.data;
        } catch (error) {
          console.error("Error al obtener todos los usuarios: ", error);
          if (error.response) {
              console.error("Response data:", error.response.data);
          }
          throw error;
      }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosConfig.get(`/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener el usuario: ", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
            throw error;
        }
    },

    updateUser: async (userData) => {
        try {
            const response = await axiosConfig.put("/usuarios", userData, {
              headers: {
                  "Content-Type": "application/json", 
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
              return response.data;
          } catch (error) {
              console.error("Error al actualizar el usuario:", error);
              if (error.response) {
                  console.error("Response data:", error.response.data);
              }
              throw error;
          }
    },

    deleteUserById: async (id) => {
        try {
            const response = await axiosConfig.delete(`/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al eliminar usuario por ID:", error);
            throw error;
        }
    }
};
