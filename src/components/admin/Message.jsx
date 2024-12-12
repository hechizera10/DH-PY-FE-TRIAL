import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const Message = ({ type, text, onClose }) => {
  // Definir los estilos y el ícono basado en el tipo de mensaje
  const messageStyles = {
    success: {
      icon: <FaCheckCircle className="h-7 w-7 mr-6" />,
      bgColor: "bg-green-400",
      textColor: "text-green-100",
    },
    info: {
      icon: <FaInfoCircle className="h-7 w-7 mr-6" />,
      bgColor: "bg-blue-400",
      textColor: "text-blue-100",
    },
    warning: {
      icon: <FaExclamationTriangle className="h-7 w-7 mr-6" />,
      bgColor: "bg-yellow-400",
      textColor: "text-yellow-100",
    },
    danger: {
      icon: <FaTimesCircle className="h-7 w-7 mr-6" />,
      bgColor: "bg-red-400",
      textColor: "text-red-100",
    },
  };

  const { icon, bgColor, textColor } = messageStyles[type] || messageStyles.info;

  return (
    <div className={`px-8 py-6 ${bgColor} text-white flex justify-between rounded`}>
      <div className="flex items-center">
        {icon}
        <p>{text}</p>
      </div>
      <button onClick={onClose} className={`${textColor} hover:text-white`}>
        <FaTimesCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Message;
