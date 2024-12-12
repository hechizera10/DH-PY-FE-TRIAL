import axiosConfig from "./axiosConfig";

export const favoritosService = {

  agregarFavorito: async (obraId) => {
    try {
      const response = await axiosConfig.post(`/usuarios/favoritos/${obraId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      if (error.response) {
        throw new Error(error.response.data || "Error al agregar a favoritos");
      }
      throw new Error("No se pudo agregar a favoritos. Por favor, verifica tu conexión.");
    }
  },

  eliminarFavorito: async (obraId) => {
    try {
      const response = await axiosConfig.delete(`/usuarios/favoritos/${obraId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      if (error.response) {
        throw new Error(error.response.data || "Error al eliminar de favoritos");
      }
      throw new Error("No se pudo eliminar de favoritos. Por favor, verifica tu conexión.");
    }
  },

  obtenerFavoritos: async () => {
    try {
      const response = await axiosConfig.get("/usuarios/favoritos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      if (error.response) {
        throw new Error(error.response.data || "Error al obtener favoritos");
      }
      throw new Error("No se pudieron obtener los favoritos. Por favor, verifica tu conexión.");
    }
  }

}

