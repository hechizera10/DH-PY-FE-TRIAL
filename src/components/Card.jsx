import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FaHeart } from "react-icons/fa";
import { useContextGlobal } from "../utils/global.context";
import Modal from "./Modal";
import { favoritosService } from "../api/favoritosService.js";

const Card = ({ producto, isFavorite: initialIsFavorite }) => {
    const { state, dispatch } = useContextGlobal();
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const lastRequestTimeRef = useRef(0); // Ref para almacenar el tiempo del último POST
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const toggleFavorite = useCallback(
        async (e) => {
            e.stopPropagation();

            if (!state.loggedUser) {
                setErrorMessage("Debes estar logueado para guardar favoritos.");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            const currentTime = Date.now();
            if (currentTime - lastRequestTimeRef.current < 5000) {
                console.log("Operación ignorada: demasiado pronto");
                return;
            }

            lastRequestTimeRef.current = currentTime;

            // Optimistic update
            setIsFavorite(prevFavorite => !prevFavorite);

            try {
                const isCurrentlyInFavorites = state.favorites?.some(
                    (fav) => fav.id === producto.id
                );

                if (isCurrentlyInFavorites) {
                    await favoritosService.eliminarFavorito(producto.id);
                    dispatch({
                        type: "REMOVE_FROM_FAVORITES",
                        payload: producto,
                    });
                } else {
                    await favoritosService.agregarFavorito(producto.id);
                    dispatch({
                        type: "ADD_TO_FAVORITES",
                        payload: producto,
                    });
                }
            } catch (error) {
                console.error("Error al manejar favoritos:", error);
                setErrorMessage(
                    error.message || "Error al actualizar favoritos"
                );
                setTimeout(() => setErrorMessage(""), 3000);

                // Revert optimistic update if there's an error
                setIsFavorite(prevFavorite => !prevFavorite);
            }
        },
        [state.loggedUser, state.favorites, producto, dispatch]
    );

    const displayFavorite = state.loggedUser ? isFavorite : false;

    if (!producto) {
        return (
            <div className="relative overflow-hidden h-100 rounded-xl bg-white/10 backdrop-blur-sm border-dashed border-2 border-white-200 opacity-40">
                <div className="h-full w-full flex flex-col align-center justify-center text-center text-white">
                    Obra no disponible 😔
                </div>
            </div>
        );
    }

    // Rest of the component remains the same as in the original code
    const {
        nombre,
        img,
        descripcion,
        precioRenta,
        tamano,
        tecnicaObra,
        movimientoArtistico,
        artista,
        fechaCreacion,
    } = producto;

    return (
        <div className="relative">
            {errorMessage && (
                <div className="absolute top-0 left-0 w-full text-red-500 text-sm mb-2 transition-opacity duration-300 opacity-100">
                    {errorMessage}
                </div>
            )}
            <div
                className="group relative w-full hover:cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                {/* ... rest of the original render method ... */}
                <button
                    className={`absolute top-2 right-2 text-white p-2 rounded-full ${
                        displayFavorite ? "bg-black" : "bg-gray-500"
                    } hover:opacity-80 transition-opacity`}
                    onClick={toggleFavorite}
                    aria-label={
                        displayFavorite
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                    }
                    disabled={!state.loggedUser}
                >
                    <FaHeart
                        size={20}
                        color={displayFavorite ? "#EFB810" : "black"}
                    />
                </button>
                {/* ... rest of the original render method ... */}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                producto={producto}
            />
        </div>
    );
};

Card.propTypes = {
    producto: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        precioRenta: PropTypes.number.isRequired,
        tamano: PropTypes.string.isRequired,
        tecnicaObra: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,
        movimientoArtistico: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,
        artista: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,
        fechaCreacion: PropTypes.string.isRequired,
    }).isRequired,
    isFavorite: PropTypes.bool,
};

export default Card;