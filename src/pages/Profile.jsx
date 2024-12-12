import React, { useState, useEffect } from "react";
import { useContextGlobal } from "../utils/global.context.jsx";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { RiArrowGoBackFill } from "react-icons/ri";
import reservasService from "../api/reservasService.js";

const Profile = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [obras, setObras] = useState([]);

  const toggleFavorites = () => {
    setIsFavoritesOpen(!isFavoritesOpen);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
    };

  useEffect(() => {
    const fetchReservas = async () => {
      if (state.loggedUser) {
        try {
          const userReservas = await reservasService.obtenerReservasPorUsuario(
            state.loggedUser.id
          );
          setReservas(userReservas);
        } catch (error) {
          console.error("Error al obtener las reservas:", error);
        }
      }
    };

    fetchReservas();
  }, [state.loggedUser]);

  console.log(state.loggedUser?.rol);
  console.log(state.loggedUser);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const obrasData = await reservasService.obtenerObrasDisponibles(); // Método para obtener las obras
        setObras(obrasData);
      } catch (error) {
        console.error("Error al obtener las obras:", error);
      }
    };

    fetchObras();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-black profile">
      <div className="flex items-center justify-around mx-auto mt-20 align center">
        <h1 className="text-4xl font-bold text-[#FDB813] text-center mb-12 pl-4 pt-12">
          Perfil
        </h1>

        <button
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary rounded-lg text-black hover:bg-primary/90 transition-colors text-sm sm:text-base"
          onClick={() => navigate("/")}
        >
          <RiArrowGoBackFill size={20} />
          <span>Regresar</span>
        </button>
      </div>
      {state.users ? (
        <div className="max-w-3xl mx-auto text-white bg-black">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-start justify-between md:flex-row lg:flex-row">
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="mb-1 text-lg font-semibold text-gray-600">
                    Nombre
                  </h2>
                  <p className="text-gray-800">{state.loggedUser.nombre}</p>
                </div>

                <div className="mb-6">
                  <h2 className="mb-1 text-lg font-semibold text-gray-600">
                    Email
                  </h2>
                  <p className="text-gray-800">{state.loggedUser.email}</p>
                </div>

                <div className="mb-6">
                  <h2 className="mb-1 text-lg font-semibold text-gray-600">
                    Preferencias
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-800">
                    Me guuuUsta el arrrte.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-auto mx-auto md:w-96 lg:w-96">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {state.loggedUser?.rol[0]?.authority}
                </h2>
                <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full">
                  <svg
                    className="w-20 h-20 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <button
                  onClick={() => navigate("/administracion")}
                  className={`w-full mt-4 py-2 font-semibold rounded-lg transition-colors ${
                    state.loggedUser?.rol[0]?.authority === "ADMIN" ||
                    state.loggedUser?.rol[0]?.authority === "COLAB"
                      ? "bg-[#FDB813] text-black hover:bg-[#FDB813]/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={
                    state.loggedUser?.rol[0]?.authority !== "ADMIN" &&
                    state.loggedUser?.rol[0]?.authority !== "COLAB"
                  }
                >
                  Administrar obras
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 mb-4 bg-gray-200 rounded-lg cursor-pointer" onClick={toggleFavorites}>
              <h2 className="mb-1 text-lg font-semibold text-gray-600">
                Favoritos
              </h2>
              <button  className="text-gray-400">
                {isFavoritesOpen ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 8l4 4H6l4-4z" />
                  </svg>
                )}
              </button>
            </div>

            {isFavoritesOpen && (
              <div className="p-4 text-black bg-white rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:text-black">
                  {state.favorites.map((producto) => (
                    <Card
                      key={producto.id}
                      producto={producto}
                      isFavorite={true}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 mt-4 mb-4 bg-gray-200 rounded-lg cursor-pointer" onClick={toggleHistory}>
              <h2 className="mb-1 text-lg font-semibold text-gray-600">
                Historial de Reservas
              </h2>
              <button className="text-gray-400">
                {isHistoryOpen ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 8l4 4H6l4-4z" />
                  </svg>
                )}
              </button>
            </div>
            {isHistoryOpen && (
              <div className="p-4 text-black bg-white rounded-lg">
                {reservas.length > 0 ? (
                  reservas.map((reserva) => {
                    const obra = obras.find(
                      (o) => o.id === reserva.producto?.id
                    ); // Buscar la obra por ID
                    return (
                      <div key={reserva.id} className="p-2 mb-4 border-b">
                        <p>
                          <strong>Obra:</strong>{" "}
                          {reserva ? reserva.nombreObra : "Obra no encontrada"}
                        </p>
                        <p>
                          <strong>Fecha de Inicio:</strong>{" "}
                          {new Date(reserva.fechaInicio).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Fecha de Fin:</strong>{" "}
                          {new Date(reserva.fechaFin).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No tienes reservas realizadas.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-white">No hay usuario logueado.</div>
      )}
    </div>
  );
};

export default Profile;
