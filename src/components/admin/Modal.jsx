import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const Modal = ({ type, text, options, isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
			id="modal-id"
		>
			<div className="absolute bg-black opacity-80 inset-0 z-0"></div>
			<div className="relative w-full max-w-lg p-5 mx-4 my-6 bg-white rounded-xl shadow-lg">
				{/* Contenido dinámico basado en el tipo de modal */}
				<div className="text-center p-5 flex-auto justify-center">
					{type === "delete" && (
						<>
							{/* Icono de advertencia */}
							<FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
							<h2 className="text-xl font-bold py-4">
								¿Estás seguro?
							</h2>
							<p className="text-sm text-gray-500 px-8">
								{text ||
									"¿Realmente deseas eliminar este elemento? Esta acción no se puede deshacer."}
							</p>
						</>
					)}
					{/* Otros tipos de modal podrían manejarse aquí */}
				</div>

				{/* Footer con opciones */}
				<div className="p-3 mt-2 text-center space-x-4 md:block">
					<button
						className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
						onClick={onClose}
					>
						{options?.cancelText || "Cancelar"}
					</button>
					{type === "delete" && (
						<button
							className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
							onClick={onConfirm}
						>
							{options?.confirmText || "Eliminar"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
