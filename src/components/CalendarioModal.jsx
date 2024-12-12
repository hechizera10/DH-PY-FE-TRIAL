import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { useContextGlobal } from "../utils/global.context";
import reservasService from "../api/reservasService";
import "../styles/App.css";
import "../styles/default.css";
import "../styles/styles.css";

const CalendarioModal = ({ obra, setSelectedDates, onDateValidation }) => {
  const { isMobile } = useContextGlobal();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [disabledDates, setDisabledDates] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setIsLoading(true);
        // Obtener un rango amplio para verificar disponibilidad (por ejemplo, próximos 6 meses)
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

        const fechaInicio = today.toISOString().split('T')[0];
        const fechaFin = sixMonthsLater.toISOString().split('T')[0];

        // Obtener las reservas para la obra específica
        const reservasObra = await reservasService.verificarDisponibilidad(
          obra.id,
          fechaInicio,
          fechaFin
        );

        // Convertir las fechas reservadas a objetos Date
        const fechasDeshabilitadas = reservasObra.flatMap((reserva) => {
          const fechaInicio = new Date(reserva.fechaInicio + 'T00:00:00');
          const fechaFin = new Date(reserva.fechaFin + 'T00:00:00');
          const diasReservados = [];
          let currentDate = new Date(fechaInicio);

          while (currentDate <= fechaFin) {
            diasReservados.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }

          return diasReservados;
        });

        setDisabledDates(fechasDeshabilitadas);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
        setValidationError("Error al cargar las fechas disponibles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservas();
  }, [obra.id]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    
    // Siempre actualizamos el rango visual
    setDateRange([ranges.selection]);
    
    // Validamos después de actualizar el rango visual
    const validationResult = validateDateRange(startDate, endDate);
    
    if (validationResult.isValid) {
      setSelectedDates(ranges.selection);
      setValidationError("");
      if (onDateValidation) {
        onDateValidation(true);
      }
    } else {
      setSelectedDates(null); // Importante: no guardamos fechas inválidas
      setValidationError(validationResult.error);
      if (onDateValidation) {
        onDateValidation(false);
      }
    }
  };

  const validateDateRange = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalizar las fechas para comparación
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      return {
        isValid: false,
        error: "La fecha de inicio no puede ser en el pasado"
      };
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.ceil((end - start) / millisecondsPerDay);

    if (daysDifference < 7) {
      return {
        isValid: false,
        error: "El alquiler mínimo es de 7 días"
      };
    }

    // Verificar si hay fechas reservadas en el rango seleccionado
    const hasReservedDates = disabledDates.some(disabledDate => {
      const currentDate = new Date(disabledDate);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= start && currentDate <= end;
    });

    if (hasReservedDates) {
      return {
        isValid: false,
        error: "Algunas fechas seleccionadas ya están reservadas"
      };
    }

    return { isValid: true, error: "" };
  };

  const isDateDisabled = (date) => {
    return disabledDates.some(disabledDate => {
      const currentDate = new Date(date);
      const disabledDateTime = new Date(disabledDate);
      
      // Normalizar las fechas para comparación
      currentDate.setHours(0, 0, 0, 0);
      disabledDateTime.setHours(0, 0, 0, 0);
      
      return currentDate.getTime() === disabledDateTime.getTime();
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {validationError && (
        <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
          <span className="block sm:inline">{validationError}</span>
        </div>
      )}
      
      <DateRangePicker
        ranges={dateRange}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        months={2}
        direction={isMobile ? "vertical" : "horizontal"}
        staticRanges={[]}
        inputRanges={[]}
        showDateDisplay={true}
        minDate={new Date()}
        disabledDay={() => false} // Importante: permitir selección de cualquier día
        dayContentRenderer={(date) => {
          const isDisabled = isDateDisabled(date);
          return (
            <div
              className={`calendar-day ${
                isDisabled ? "calendar-day-disabled" : "calendar-day-available"
              }`}
            >
              {date.getDate()}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarioModal;
