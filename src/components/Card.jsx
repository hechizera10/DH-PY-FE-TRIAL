import React, { useState, useCallback, useContext } from "react";
import { ContextGlobal } from "../context/ContextGlobal";
import { enqueueFavoriteAction } from "../utils/localStorage"; // Funciones para manejar la cola
import "./Card.css";

const Card = ({ producto }) => {
    const { state, dispatch, setErrorMessage } = useContext(ContextGlobal);
    const [localIsFavorite, setLocalIsFavorite] = useState(
        state.favorites.some((fav) => fav.id === producto.id)
    );

    const toggleFavorite = useCallback(
        async (e) => {
            e.stopPropagation();

            if (!state.loggedUser) {
                setErrorMessage("Debes estar logueado para guardar favoritos.");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            const isCurrentlyInFavorites = state.favorites.some(
                (fav) => fav.id === producto.id
            );

            // Actualizar localmente el estado
            setLocalIsFavorite(!isCurrentlyInFavorites);
            dispatch({
                type: isCurrentlyInFavorites ? "REMOVE_FROM_FAVORITES" : "ADD_TO_FAVORITES",
                payload: producto,
            });

            // Agregar acción a la cola
            enqueueFavoriteAction({
                type: isCurrentlyInFavorites ? "REMOVE" : "ADD",
                productoId: producto.id,
            });
        },
        [state.loggedUser, state.favorites, producto, dispatch, setErrorMessage]
    );

    return (
        <div className="card" onClick={() => console.log(`Clicked on ${producto.nombre}`)}>
            <img src={producto.imagen} alt={producto.nombre} className="card-image" />
            <div className="card-body">
                <h3 className="card-title">{producto.nombre}</h3>
                <p className="card-description">{producto.descripcion}</p>
                <button
                    className={`favorite-button ${localIsFavorite ? "favorited" : ""}`}
                    onClick={toggleFavorite}
                >
                    {localIsFavorite ? "❤️ Quitar" : "🤍 Favorito"}
                </button>
            </div>
        </div>
    );
};

export default Card;
