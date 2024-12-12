import React, { useState } from "react";
import { useContextGlobal } from "../utils/global.context.jsx";
import CalendarioModal from './CalendarioModal.jsx';
import { useNavigate, Link } from "react-router-dom";

import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { BsRulers } from "react-icons/bs";
import { BsPalette } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { FaCalendarCheck } from "react-icons/fa";
import ModalPolicies from "./ModalPolicies.jsx";

const Modal = ({ isOpen, onClose, producto }) => {
  const navigate = useNavigate();
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const { state } = useContextGlobal();

  // Estados para el calendario
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [isDateValid, setIsDateValid] = useState(false);
  const [calendarioError, setCalendarioError] = useState(false);

  if (!isOpen) return null;

  const todasLasImagenes = [
    ...(producto.imagenes || []),
  ];

  const siguienteImagen = () => {
    setImagenActual((prev) =>
      prev === todasLasImagenes.length - 1 ? 0 : prev + 1
    );
  };

  const anteriorImagen = () => {
    setImagenActual((prev) =>
      prev === 0 ? todasLasImagenes.length - 1 : prev - 1
    );
  };

  const toggleCalendario = () => {
    if (producto.nombre === "La Noche Estrellada") {
      setCalendarioError(true);
    } else {
      setCalendarioError(false);
      setMostrarCalendario(!mostrarCalendario);
    }
  };

  const reintentarCargarCalendario = () => {
    setCalendarioError(false);
    setMostrarCalendario(true);
  };

  const handleDateValidation = (isValid) => {
    setIsDateValid(isValid);
  };

  const handleReservation = () => {
    if (!state.loggedUser) {
      navigate("/login");
    } else if (isDateValid) {
      navigate(`/reservar/${producto.id}`, {
        state: { 
          selectedDates,
          productoSeleccionado: producto // Añadir el producto completo al state
        }
      });
    } else {
      alert("Por favor, seleccione fechas válidas.");
    }
  };

  const CarruselModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={() => setMostrarCarrusel(false)}
        className="absolute p-2 text-white top-4 right-4 hover:text-gray-300"
      >
        <IoMdClose size={24} />
      </button>
      <button
        onClick={anteriorImagen}
        className="absolute p-2 text-white left-4 hover:text-gray-300"
      >
        <MdNavigateBefore size={40} />
      </button>
      <button
        onClick={siguienteImagen}
        className="absolute p-2 text-white right-4 hover:text-gray-300"
      >
        <MdNavigateNext size={40} />
      </button>
      <img
        src={todasLasImagenes[imagenActual]?.url}
        alt={`Imagen ${imagenActual + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  );

  const calcularDuracionAlquiler = () => {
    if (!selectedDates) return 0;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((selectedDates.endDate - selectedDates.startDate) / millisecondsPerDay);
  };

  const calcularPrecioTotal = () => {
    if (!selectedDates) return 0;
    const duracion = calcularDuracionAlquiler();
    return duracion * producto.precioRenta;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-12 sm:overflow-y-scroll">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          // onClick={onClose}
        />

        <div className="relative w-full max-w-6xl mx-auto">
        {/* Header negro */}
          <div className="p-4 text-white bg-black rounded-t-xl">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl text-primary line-clamp-1">
                  {producto.nombre}
                </h2>
                <p className="text-sm italic text-primary sm:text-base">
                  {producto.artista?.nombre}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary rounded-lg text-black hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <RiArrowGoBackFill size={20} />
                <span>Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-b-xl p-4 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex flex-col gap-4 lg:flex-row sm:gap-6">
              {/* Columna izquierda: Imagen principal */}
              <div className="flex-1 overflow-y-auto">
                <img
                  src={producto.imagenes?.find((imagen) => imagen.nombre.toLowerCase().startsWith("principal"))?.url ||
                    producto.imagenes?.[0]?.url}
                  alt={producto.nombre}
                  className="w-full aspect-[4/3] object-contain rounded-lg mb-4 sm:mb-6"
                />

                {/* Botón para mostrar/ocultar calendario */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={toggleCalendario}
                    className="flex items-center gap-2 px-4 py-2 text-black rounded bg-primary hover:bg-primary/90"
                  >
                    <FaCalendarCheck />
                    {mostrarCalendario ? 'Ocultar Calendario' : 'Mostrar Calendario'}
                  </button>
                </div>

                {/* Calendario Modal */}
                {calendarioError ? (
                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="font-semibold text-red-600">
                      Error: No se pudo cargar la información de las fechas.
                    </p>
                    <button
                      onClick={reintentarCargarCalendario}
                      className="px-4 py-2 mt-2 text-black rounded bg-primary hover:bg-primary/90"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  mostrarCalendario && (
                    <CalendarioModal
                      obra={producto}
                      setSelectedDates={setSelectedDates}
                      onDateValidation={handleDateValidation}
                    />
                  )
                )}

                {/* Resumen de Fechas Seleccionadas */}
                {selectedDates && (
                  <div className="p-4 mt-4 bg-gray-100 rounded-lg">
                    <h3 className="mb-2 text-lg font-semibold">Resumen de Alquiler</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Inicio:</p>
                        <p>{selectedDates.startDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Fin:</p>
                        <p>{selectedDates.endDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duración:</p>
                        <p>{calcularDuracionAlquiler()} días</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Precio Total:</p>
                        <p>$ {calcularPrecioTotal().toLocaleString()} USD</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Información detallada */}
                <div className="mt-5 mb-5 space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 sm:text-sm">Fecha de creación:</p>
                    <p className="text-sm sm:text-base">{producto.fechaCreacion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 sm:text-sm">Descripción:</p>
                    <p className="text-sm sm:text-base">{producto.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 sm:text-sm">Dimensiones:</p>
                    <p className="text-sm sm:text-base">{producto.tamano}</p>
                  </div>
                </div>
              </div>

              

              {/* Columna derecha: Miniaturas y botones */}
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {producto.imagenes
                    ?.slice(0, 3)
                    .map((imagen, index) => (
                      <img
                        key={index}
                        src={imagen.url}
                        alt={`Miniatura ${index + 1}`}
                        className="object-cover w-full rounded-lg aspect-square"
                      />
                    ))}
                  <div
                    className="relative cursor-pointer" onClick={() => setMostrarCarrusel(true)}>
                      {producto.imagenes?.[3] ? (
                        <img
                          src={producto.imagenes?.[3].url}
                          alt="Ver más"
                          className="object-cover w-full rounded-lg aspect-square"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full bg-gray-200 rounded-lg aspect-square">
                          <span className="text-sm text-gray-500">No hay más imágenes</span>
                        </div> 
                      )}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-white sm:text-base">Ver más</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 lg:grid-cols-1 sm:gap-3">
                  <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 border-2 border-gray-400 rounded-lg sm:text-base">
                    <BsRulers className="text-xl" />
                    <span className="line-clamp-1">{producto.tamano}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 border-2 border-gray-400 rounded-lg sm:text-base">
                    <BsPalette className="text-xl" />
                    <span className="line-clamp-1">{producto.tecnicaObra?.nombre}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 border-2 border-gray-400 rounded-lg sm:text-base">
                    <BsPerson className="text-xl" />
                    <span className="line-clamp-1">{producto.movimientoArtistico?.nombre}</span>
                  </div>
                </div>
                
                <p className="mb-2 text-xl font-bold text-center sm:text-2xl">
                  $ {producto.precioRenta?.toLocaleString()} USD
                </p>

                {/* Botón de Alquiler con validación de fechas */}
                {state.loggedUser ? (
                  <button 
                    onClick={handleReservation}
                    className={`w-full py-3 font-bold rounded-lg transition-colors mb-3 ${
                      isDateValid 
                        ? 'bg-primary text-black hover:bg-primary/90' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isDateValid}
                  >
                    {isDateValid ? 'Alquilar' : 'Seleccione Fechas Válidas'}
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full py-3 mb-3 text-white transition-colors rounded-lg opacity-50 cursor-not-allowed bg-primary hover:bg-primary"
                      disabled
                    >
                      Alquilar
                    </button>
                    <div className="flex flex-col items-center justify-start p-2 mb-4 text-black bg-gray-300 rounded-lg">
          <p>Debe estar autenticado para alquilar una obra.</p>
          <Link to="/login">
            <button className="mt-2 px-4 py-2 bg-[#FDB813] text-black rounded-lg hover:bg-[#FDB813]/90 transition">
              Iniciar Sesión
            </button>
          </Link>
        </div>
                  </>
                )}
              </div>
            </div>
              <ModalPolicies />
          </div>
        </div>
      </div>
      {mostrarCarrusel && <CarruselModal />}
    </>
  );
};

export default Modal