import axiosConfig from "./axiosConfig";

export const categoriaService = {
  getCategorias: async () => {
      try {
          const response = await axiosConfig.get("/movimientoArtistico/listartodos", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          return response.data;
      } catch (error) {
        console.error("Error al obtener todas las categorias: ", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
  },

  getCategoria: async (id) => {
      try {
          const response = await axiosConfig.get(`/movimientoArtistico/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          return response.data;
      } catch (error) {
          console.error("Error al obtener la categoria: ", error);
          if (error.response) {
              console.error("Response data:", error.response.data);
          }
          throw error;
      }
  },

  createCategoria: async (formData) => {  
      try {
          const response = await axiosConfig.post("/movimientoArtistico", formData, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
          console.log("Response:", response);
          return response.data;
      } catch (error) {
          console.error("Error guardando la categoria:", error);
          if (error.response) {
            throw new Error(error.response.data || "Error desconocido al crear la categoría.");
              //console.error("Response data:", error.response.data);
          }else{
            throw new Error("No se pudo crear la categoria. Por favor, verifica tu conexión o intenta nuevamente.");
          } 
          throw error;
      }
  },

  updateCategoria: async (formData) => {
      try {
        const response = await axiosConfig.put("/movimientoArtistico", formData, {
          headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
          return response.data;
      } catch (error) {
          console.error("Error actualizando la categoria:", error);
          if (error.response) {
            throw new Error(error.response.data || "Error desconocido al actualziar la categoría.");
          }else{
            throw new Error("No se pudo actualizar la categoria. Por favor, verifica tu conexión o intenta nuevamente.");
          } 
          //throw error;
      }
  },

  deleteCategoria: async (id) => {
      try {
          const response = await axiosConfig.delete(`/movimientoArtistico/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
          return response.data;
      } catch (error) {
          console.error("Error en la eliminacion de categoria:", error);
          if (error.response) {
            throw new Error(error.response.data || "Error desconocido al eliminar la categoría.");
          }else{
            throw new Error("No se pudo eliminar la categoria. Por favor, verifica tu conexión o intenta nuevamente.");
          } 
      }
  },
}