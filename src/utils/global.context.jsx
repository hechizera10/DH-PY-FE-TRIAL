import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { reducer } from "../reducers/reducer";
import { 
    saveToLocalStorage, 
    loadFromLocalStorage, 
    removeFromLocalStorage 
} from "./localStorage"; // Importar funciones de localStorage
import axiosConfig from "../api/axiosConfig";

export const ContextGlobal = createContext(undefined);

export const initialState = {
    theme: "light",
    data: loadFromLocalStorage("data") || [],
    categories: loadFromLocalStorage("categories") || [],
    users: loadFromLocalStorage("users") || [],
    images: loadFromLocalStorage("images") || [],  // Cargar imágenes desde localStorage
    activeSection: "obras",
    user: null,
    loggedUser: loadFromLocalStorage("loggedUser") || null,
    favorites: loadFromLocalStorage("favorites") || [],
};

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isMobile, setIsMobile] = useState(false);

    // Evaluar si es mobile
    const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 769);
    };

    useEffect(() => {
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // Intentar cargar datos desde el backend
    useEffect(() => {
        const fetchBackendData = async () => {
            const token = localStorage.getItem("token");
            try {            
                // Verificar si el token existe  
                const config = token
                ? { headers: { 'Authorization': `Bearer ${token}` } }
                : {}; // No enviar headers si no hay token

                // Intentar obtener datos desde el backend
                const [artResponse, categoriesResponse] = await Promise.all([
                    axiosConfig.get(`/obra/listartodos`, config),
                    axiosConfig.get(`/movimientoArtistico/listartodos`, config),
                ]);

                // Actualizar estado con los datos obtenidos
                dispatch({ type: "GET_ART", payload: artResponse ? artResponse.data : [] });
                dispatch({ type: "GET_CATEGORIES", payload: categoriesResponse ? categoriesResponse.data : [] });

                // Guardar en localStorage
                saveToLocalStorage("data", artResponse.data);
                saveToLocalStorage("categories", categoriesResponse.data);

            } catch (error) {
                console.error("Error al conectar con el backend, cargando datos locales.", error);
            }
        };

        fetchBackendData();
    }, []);

    const fetchUsersByRole = async (token, userRole= state.loggedUser?.rol) => {
        console.log(userRole[0]?.authority);
   
        if (!token || !userRole) return;
        console.log("Pasó primer if");
        
        try {
            if (userRole[0]?.authority === "ADMIN" || userRole[0]?.authority === "COLAB") {
                console.log("Pasó segundo if");
                console.log("Token actual:", token);

                const response = await axiosConfig.get('/usuarios/listartodos', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Usuarios obtenidos:", response.data);
    
                // Actualiza el estado y localStorage
                dispatch({ type: "GET_USERS", payload: response.data });
                saveToLocalStorage("users", response.data);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            console.error("Detalles del error:", error.response?.data || error);
            console.error("Error al obtener usuarios por rol:", error.response?.data || error.message);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Estado de loggedUser:", state.loggedUser);
   
        // Si hay un usuario logueado y su rol está disponible, cargar los usuarios
        if (state.loggedUser && state.loggedUser.rol) {
            fetchUsersByRole(token, state.loggedUser.rol);
        }
    }, [state.loggedUser]); // Este effect depende de state.loggedUser, se ejecuta cuando el usuario se loguea


    // Guardar cambios de estado en localStorage
    useEffect(() => {
        if (state.data.length > 0) saveToLocalStorage("data", state.data);
        if (state.categories.length > 0) saveToLocalStorage("categories", state.categories);
        if (state.users.length > 0) saveToLocalStorage("users", state.users);
    }, [state.data, state.categories, state.users]);
    
    return (
        <ContextGlobal.Provider value={{ state, dispatch, isMobile }}>
            {children}
        </ContextGlobal.Provider>
    );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);