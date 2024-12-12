import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { FaHeart } from "react-icons/fa";
import { useContextGlobal } from "../utils/global.context";
import Modal from "./Modal";
import { enqueueFavoriteAction } from "../utils/favoriteQueue";

const Card = ({ producto, isFavorite: initialIsFavorite }) => {
  const { state, dispatch } = useContextGlobal();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(initialIsFavorite);

  const toggleFavorite = useCallback(
    (e) => {
      e.stopPropagation();

      if (!state.loggedUser) {
        setErrorMessage("Debes estar logueado para guardar favoritos.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      const isCurrentlyInFavorites = state.favorites?.some(
        (fav) => fav.id === producto.id
      );

      setLocalIsFavorite(!isCurrentlyInFavorites);
      dispatch({
        type: isCurrentlyInFavorites
          ? "REMOVE_FROM_FAVORITES"
          : "ADD_TO_FAVORITES",
        payload: producto,
      });

      enqueueFavoriteAction({
        type: isCurrentlyInFavorites ? "REMOVE" : "ADD",
        productoId: producto.id,
        producto,
      });
    },
    [state.loggedUser, state.favorites, producto, dispatch]
  );

  useEffect(() => {
    // Sincronización inicial con el backend
    if (state.loggedUser) {
      setLocalIsFavorite(
        state.favorites?.some((fav) => fav.id === producto.id)
      );
    }
  }, [state.favorites, state.loggedUser, producto]);

  const displayFavorite = state.loggedUser ? localIsFavorite : false;

  if (!producto) {
    return (
      <div className="relative overflow-hidden h-100 rounded-xl bg-white/10 backdrop-blur-sm border-dashed border-2 border-white-200 opacity-40">
        <div className="h-full w-full flex flex-col align-center justify-center text-center text-white">
          Obra no disponible 😔
        </div>
      </div>
    );
  }

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
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0" />
        <div className="relative overflow-hidden h-100 rounded-xl bg-white backdrop-blur-sm text-black">
          <div className="relative">
            <img
              className="h-48 w-full object-cover"
              src={
                producto.imagenes?.find((imagen) =>
                  imagen.nombre.toLowerCase().startsWith("principal")
                )?.url || producto.imagenes?.[0]?.url
              }
              alt={producto.nombre}
              loading="lazy"
            />
            <button
              className={`absolute top-2 right-2 text-white p-2 rounded-full ${
                displayFavorite ? "bg-black" : "bg-gray-500"
              }`}
              onClick={toggleFavorite}
              aria-label={
                displayFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
              disabled={!state.loggedUser}
            >
              <FaHeart size={20} color={displayFavorite ? "#EFB810" : "black"} />
            </button>
          </div>
          <div className="p-4 bg-white flex flex-col h-48 text-black">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {nombre}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {descripcion}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-primary">
                ${precioRenta}
              </span>
              <span className="bg-amber-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {tamano}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-amber-50 text-black px-3 py-1 rounded-full text-xs font-medium">
                {tecnicaObra.nombre}
              </span>
              <span className="bg-amber-50 text-black px-3 py-1 rounded-full text-xs font-medium">
                {movimientoArtistico.nombre}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-medium">{artista.nombre}</span>
              <span>{fechaCreacion}</span>
            </div>
          </div>
        </div>
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
