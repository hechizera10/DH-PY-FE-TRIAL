import { removeFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { idCreator } from "../utils/formatFunctions";

export const reducer = (state, action) => {
  switch (action.type) {
    // GET - LEER
    case "GET_ART":
      return { ...state, data: action.payload };

    case "GET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "GET_USERS":
      return { ...state, users: action.payload };

    // ADD - CREAR
    case "ADD_ART":
      console.log("Agregando obra:", action.payload);
      const newObra = action.payload;
      const newDataArt = [...state.data, newObra];
      saveToLocalStorage("data", newDataArt);
      return { ...state, data: newDataArt };

    case "ADD_CATEGORY":
      const newCatWithId = {
        ...action.payload,
        id: idCreator(state.categories),
      };
      const newDataCategories = [...state.categories, newCatWithId];
      saveToLocalStorage("categories", newDataCategories);
      return { ...state, categories: newDataCategories };

    case "ADD_USER":
      const newUser = action.payload; // La respuesta de la API con el usuario creado
      const updatedListUsers = [...state.users, newUser];
      saveToLocalStorage("users", updatedListUsers);
      return { ...state, users: updatedListUsers };

    case "LOGIN_USER":
      saveToLocalStorage("loggedUser", action.payload)  
    return {
      ...state,
        loggedUser: action.payload, 
        token: action.payload.token,       
      };
      
    case "LOGOUT_USER":
    removeFromLocalStorage("loggedUser");
    return {
      ...state,
      loggedUser: null,
      token: null,
    };


    // UPDATE - EDITAR
    // case "UPDATE_ART":
    //   return {
    //     ...state,
    //     data: state.data.map((obra) =>
    //       obra.id === action.payload.id ? { ...obra, ...action.payload } : obra
    //     ),
    //   };

    case "UPDATE_ART":
      const updatedArtData = state.data.map((obra) =>
        obra.id === action.payload.id ? { ...obra, ...action.payload } : obra
      );
      saveToLocalStorage("data", updatedArtData);
      return { ...state, data: updatedArtData };

    case "UPDATE_CATEGORY":
      const updatedCategories = state.categories.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      saveToLocalStorage("categories", updatedCategories);
      return { ...state, categories: updatedCategories };

    case "UPDATE_USER":
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
      saveToLocalStorage("users", updatedUsers);
      return { ...state, users: updatedUsers };

    // DELETE - ELIMINAR
    case "DELETE_ART":
      const filteredData = state.data.filter(
        (item) => item.id !== action.payload.id
      );
      saveToLocalStorage("data", filteredData);
      return { ...state, data: filteredData };

    case "DELETE_CATEGORY":
      const filteredCategories = state.categories.filter(
        (item) => item.id !== action.payload.id
      );
      saveToLocalStorage("categories", filteredCategories);
      return { ...state, categories: filteredCategories };

    case "DELETE_USER":
      const filteredDataUser = state.users.filter(
        (item) => item.id !== action.payload.id
      );
      saveToLocalStorage("users", filteredDataUser);
      return { ...state, users: filteredDataUser };


      // FAVORITOS - Agregar y eliminar de favoritos
      case "SET_FAVORITES":
      // Para establecer la lista inicial de favoritos
      saveToLocalStorage("favorites", action.payload);
      return { ...state, favorites: action.payload };

      case "ADD_TO_FAVORITES":
        // Agregar el producto a la lista de favoritos
        const addedFavorites = [...state.favorites, action.payload];
        saveToLocalStorage("favorites", addedFavorites); // Guardar en localStorage
        return { ...state, favorites: addedFavorites };
  
      case "REMOVE_FROM_FAVORITES":
        // Eliminar el producto de la lista de favoritos
        const filteredFavorites = state.favorites.filter(
          (product) => product.id !== action.payload.id
        );
        saveToLocalStorage("favorites", filteredFavorites); // Guardar en localStorage
        return { ...state, favorites: filteredFavorites };  


    // IMAGENES - Manejo de imagenes en LocalStorage

    case "ADD_IMAGE":
      const newImage = {
        id: idCreator(state.images),
        ...action.payload,
      };
      const newImages = [...state.images, newImage];
      saveToLocalStorage("images", newImages);
      return { ...state, images: newImages };

      case "ADD_IMAGE_TO_ART":
        return {
          ...state,
          data: state.data.map((obra) =>
            obra.id === action.payload.artId
              ? {
                  ...obra,
                  imagenesAdicionales: [
                    ...(obra.imagenesAdicionales || []), // Si no tiene imágenes adicionales, lo inicializa como array vacío
                    action.payload.imgUrl, // Esta es la URL de la imagen subida
                  ],
                }
              : obra
          ),
        };

    case "UPDATE_IMAGE":
      const updatedImages = state.images.map((image) =>
        image.id === action.payload.id ? { ...image, ...action.payload } : image
      );
      saveToLocalStorage("images", updatedImages);
      return { ...state, images: updatedImages };

      case "DELETE_IMAGE":
        const filteredImages = state.images.filter(
          (image) => image.id !== action.payload.id
        );
        saveToLocalStorage("images", filteredImages);
        return { ...state, images: filteredImages };

    // OTRAS - Acciones extra
    case "CHANGE_THEME":
      return { ...state, theme: action.payload };

    case "SET_ACTIVE_SECTION":
      console.log("Cambiando sección a reducer:", action.payload);
      return { ...state, activeSection: action.payload };

    case "ERROR":
      console.error("Error en la acción:", action.payload);
      return { ...state };
      

    default:
      return state;
  }
};

