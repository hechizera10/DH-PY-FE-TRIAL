import React from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const PolicyView = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const policies = [
    {
      title: "Preservación de las Obras de Arte",
      description:
        "Las obras de arte alquiladas deben ser cuidadas con el máximo respeto y preservación. Está estrictamente prohibido realizar cualquier tipo de modificación en las obras. Esto incluye: limpieza no autorizada, retoques, cambios de marco o cualquier otra alteración. Las obras deben mantenerse en ambientes con temperatura y humedad controladas, alejadas de la luz solar directa y fuentes de calor. Cualquier anomalía debe ser reportada inmediatamente.",
    },
    {
      title: "Transporte y Manipulación",
      description:
        "El transporte y manipulación de las obras de arte deben realizarse exclusivamente a través de personal especializado en el manejo de piezas de alto valor. La galería proporcionará el servicio de transporte profesional tanto para la entrega como para la recolección. El cliente debe asegurar un acceso adecuado y seguro para el equipo de transporte. La manipulación por personal no autorizado puede resultar en la pérdida de la garantía.",
    },
    {
      title: "Devolución de Obras",
      description:
        "La obra debe ser devuelta en las mismas condiciones en las que fue entregada. En caso de daño, se debe notificar de inmediato a la administración, y el cliente será responsable de los costos de restauración. Antes de la devolución, se realizará una inspección detallada de la obra. Cualquier daño no reportado previamente será documentado y facturado según corresponda. La galería se reserva el derecho de tomar acciones legales en caso de daños graves.",
    },
    {
      title: "Duración del Alquiler",
      description: (
        <>
          <span className="bg-[#FDB813]/10 text-[#FDB813] font-semibold px-2 py-1 rounded">
            El tiempo mínimo de alquiler es de 7 días y el máximo de 30 días.
          </span>{" "}
          Cualquier extensión debe ser solicitada con al menos 3 días de
          anticipación y estará sujeta a la disponibilidad de la obra. Las
          renovaciones de alquiler pueden requerir una nueva inspección de la
          obra y la actualización del contrato. Las devoluciones tardías no
          autorizadas incurrirán en cargos adicionales por día.
        </>
      ),
    },
    {
      title: "Uso Exclusivo",
      description:
        "Las obras alquiladas deben ser usadas solo en los fines indicados en el contrato. Está prohibido usarlas para fines comerciales sin la autorización explícita de la galería. No se permite la reproducción fotográfica profesional sin permiso previo. El cliente no puede prestar, subalquilar o transferir la obra a terceros bajo ninguna circunstancia. Cualquier uso no autorizado resultará en la terminación inmediata del contrato.",
    },
    {
      title: "Privacidad y Seguridad",
      description:
        "Al utilizar WhatsApp como canal de comunicación, garantizamos que la información personal de los usuarios será tratada con la máxima confidencialidad. No se almacenará ni compartirá información personal sin el consentimiento explícito del usuario. Se recomienda a los usuarios que no compartan información sensible a través de WhatsApp. La galería se compromete a cumplir con las normativas de protección de datos aplicables.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-32 bg-black">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between mt-4 mb-4 align-center">

        <div className="flex-col justify-between align-center">
        <h1 className="text-5xl font-bold text-center text-[#FDB813] mb-4">
          Políticas de Reserva
        </h1>
        <p className="mb-8 text-lg text-center text-white/80">
          Términos y condiciones para el alquiler de obras de arte
        </p>
        </div>
<div className="flex flex-col justify-center align-center">
<button
            onClick={handleGoHome}
            className="mb-4 px-4 py-2 bg-[#FDB813] text-black rounded hover:bg-[#FDB813]/90 transition"
          >
            <IoClose className="w-5 h-5" />
          </button>
</div>
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-8 shadow-lg border border-[#FDB813]/20 space-y-8">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="border-b border-[#FDB813]/20 last:border-b-0 pb-6 last:pb-0"
            >
              <h3 className="text-[#FDB813] text-xl font-bold mb-3">
                {policy.title}
              </h3>
              <p className="leading-relaxed text-white/90">
                {policy.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyView;
