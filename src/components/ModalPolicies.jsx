import React, { useState, useOptimistic } from "react";
import { Link } from "react-router-dom";

const ModalPolicies = () => {
  const [optimisticState, addOptimistic] = useOptimistic(false, (state, action) => {
    if (action.type === "start") {
      return true; // Cambia el estado a "cargando"
    }
    if (action.type === "end") {
      return false; // Restablece el estado
    }
    return state;
  });

  const optimistic = async () => {
    addOptimistic({ type: "start" }); // Inicia el estado de carga
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simula una operación asíncrona de 5 segundos
    console.log("optimistic");
    addOptimistic({ type: "end" }); // Finaliza el estado de carga
  };

  const policies = [
    {
      title: "Preservación de las Obras de Arte",
      description:
        "Las obras de arte alquiladas deben ser cuidadas con el máximo respeto y preservación.",
    },
    {
      title: "Transporte y Manipulación",
      description:
        "El transporte y manipulación de las obras de arte deben realizarse exclusivamente a través de personal especializado.",
    },
    {
      title: "Devolución de Obras",
      description:
        "La obra debe ser devuelta en las mismas condiciones en las que fue entregada.",
    },
    {
      title: "Duración del Alquiler",
      description:
        "El tiempo mínimo de alquiler es de 7 días y el máximo de 30 días.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {policies.map((policy, index) => (
            <div key={index} className="p-4 rounded-lg shadow-lg">
              <h3 className="mb-2 font-bold text-black text-md">
                {policy.title}
              </h3>
              <p className="text-black-400">{policy.description}</p>
            </div>
          ))}
        </div>
        <Link to="/politicas" className="text-center text-black underline">
          Ver todas las políticas
        </Link>
      </div>
      {optimisticState && <p>Cargando...</p>}
      <button
        onClick={optimistic}
        className="mt-4 text-white bg-black rounded-lg p-2"
        disabled={optimisticState} // Desactiva el botón mientras está cargando
      >
        {optimisticState ? "Procesando..." : "Click"}
      </button>
    </div>
  );
};

export default ModalPolicies;
