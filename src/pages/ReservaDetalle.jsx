import { React, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useContextGlobal } from "../utils/global.context.jsx";
import reservasService from "../api/reservasService.js";
import { emailService } from "../api/emailService.js"; // Importar el servicio de email
import Message from "../components/admin/Message";

const ReservaDetalle = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = useContextGlobal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ visible: false, type: '', text: '' });
  const [reservaConfirmada, setReservaConfirmada] = useState(false); // Estado para controlar la reserva confirmada

  const selectedDates = location.state?.selectedDates;

  if (!state || !state.data) {
    return <div>No hay información disponible.</div>;
  }

  const producto = state.data?.find((prod) => prod.id === parseInt(id));

  if (!producto || !selectedDates) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-32 text-white bg-gray-900">
        No hay información disponible sobre el producto o las fechas seleccionadas.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!state.loggedUser) {
      window.location.href = "/login";
      return;
    }

    if (!areDatesAvailable(selectedDates)) {
      setMessage({ visible: true, type: 'danger', text: "Las fechas seleccionadas no están disponibles." });
      return;
    }

    setIsSubmitting(true);
    try {
      const reservaCreada = await reservasService.crearReserva(
        producto.id, 
        selectedDates.startDate, 
        selectedDates.endDate
      );

      if (reservaCreada) {
        // Enviar correo de confirmación
        const emailResponse = await emailService.registerConfirmation(
          state.loggedUser.email,
          `${state.loggedUser.nombre} ${state.loggedUser.apellido}`,
          selectedDates,
          producto,
          setMessage
        );

        if (emailResponse.success) {
          setMessage({ visible: true, type: 'success', text: "¡Reserva confirmada con éxito! Se ha enviado un correo de confirmación." });
          setReservaConfirmada(true);
        } else {
          setMessage({ visible: true, type: 'danger', text: "¡Reserva confirmada, pero hubo un problema al enviar el correo de confirmación!" });
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) { // Supongamos que 409 es el código para conflicto de reserva
          setMessage({ visible: true, type: 'danger', text: "Las fechas seleccionadas ya han sido reservadas por otro usuario. Por favor, elija otro rango de fechas." });
        } else {
          setMessage({ visible: true, type: 'danger', text: `Error del servidor: ${error.response.data.message || "Por favor, intente nuevamente más tarde."}` });
        }
      } else if (error.request) {
        setMessage({ visible: true, type: 'danger', text: "Error de red: No se pudo conectar al servidor. Verifique su conexión a Internet." });
      } else {
        setMessage({ visible: true, type: 'danger', text: `Error: ${error.message}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const areDatesAvailable = (dates) => {
    const disabledDates = getDisabledDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dates.startDate < today) {
      return false;
    }

    const hasReservedDates = disabledDates.some(
      (disabledDate) => 
        disabledDate >= dates.startDate && 
        disabledDate <= dates.endDate
    );

    return !hasReservedDates;
  };

  const getDisabledDates = () => {
    const reservasObra = state.data.flatMap(prod => prod.reservas || []);
    const fechasDeshabilitadas = reservasObra.flatMap((reserva) => {
      const fechaInicio = new Date(reserva.fechaInicio);
      const fechaFin = new Date(reserva.fechaFin);
      const diasReservados = [];
      let currentDate = new Date(fechaInicio);
      while (currentDate <= fechaFin) {
        diasReservados.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return diasReservados;
    });
    return fechasDeshabilitadas;
  };

  const startDate = new Date(selectedDates.startDate);
  const endDate = new Date(selectedDates.endDate);
  const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const totalPrice = producto.precioRenta * durationInDays;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-32 text-white bg-background">
      {message.visible && <Message type={message.type} text={message.text} onClose={() => setMessage({ ...message, visible: false })} />}
      <div className="flex w-full max-w-6xl p-8 bg-opacity-50 border rounded-lg shadow-lg bg-background border-primary">
        <img
          src={producto.imagenes?.find((imagen) => imagen.nombre.toLowerCase().startsWith("principal"))?.url || producto.imagenes?.[0]?.url}
          alt={producto.nombre}
          className="w-1/3 h-auto mr-4 rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-center text-[#FDB813] mb-6">
            {producto.nombre}
          </h1>
          <p className="mb-4 text-lg text-gray-300">{producto.descripcion}</p>
          <h3 className="mt-6 text-2xl font-semibold text-[#FDB813]">Detalles de la Reserva</h3>
          <p className="text-gray-300">
            <strong>Ubicación:</strong> {producto.ubicacion}
          </p>
          <p className="text-gray-300">
            <strong>Fecha de Inicio:</strong> {startDate.toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <strong>Fecha de Fin:</strong> {endDate.toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <strong>Duración en días:</strong> {durationInDays} días
          </p>
          <p className="text-lg font-bold text-[#FDB813]">
            <strong>Precio Total:</strong> ${totalPrice.toLocaleString()} USD
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[#FDB813]">Información Adicional</h3>
          <p className="text-gray-300">
            <strong>Técnica:</strong> {producto.tecnicaObra?.nombre}
          </p>
          <p className="text-gray-300">
            <strong>Dimensiones:</strong> {producto.tamano}
          </p>
          <p className="text-gray-300">
            <strong>Artista:</strong> {producto.artista?.nombre}
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[#FDB813]">Información del Usuario</h3>
          <p className="text-gray-300">
            <strong>Nombre:</strong> {state.loggedUser?.nombre}
          </p>
          <p className="text-gray-300">
            <strong>Apellido:</strong> {state.loggedUser?.apellido}
          </p>
          <p className="text-gray-300">
            <strong>Correo Electrónico:</strong> {state.loggedUser?.email}
          </p>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || reservaConfirmada} // Desactivar el botón si la reserva ya fue confirmada
            className={`mt-6 px-6 py-3 bg-[#FDB813] text-black rounded hover:bg-[#FDB813]/90 transition ${
              isSubmitting || reservaConfirmada ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Procesando..." : reservaConfirmada ? "Reserva Confirmada" : "Confirmar Reserva"}
          </button>

          {reservaConfirmada && (
            <div className="p-4 mt-4 text-green-500 border rounded-lg bg-green-500/10 border-green-500/20">
              <p className="text-center">¡Reserva confirmada! Se ha enviado un correo de confirmación.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/politicas" className="text-[#FDB813] underline">
              Ver Políticas de Reserva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetalle;