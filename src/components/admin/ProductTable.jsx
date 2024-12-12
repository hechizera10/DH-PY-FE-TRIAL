import { useContextGlobal } from "../../utils/global.context";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Form from "./Form";
import Modal from "./Modal";
import Message from "./Message";
import { priceRangeCalculator, roundToNearest50 } from "../../utils/formatFunctions";
import { obrasService } from "../../api/services"


const ProductTable = () => {
	const { state, dispatch } = useContextGlobal(); // Desestructuramos dispatch
	const itemsPerPage = 5;
	const [currentPage, setCurrentPage] = useState(1);
	const [editingItem, setEditingItem] = useState(null);
	const [deletingItem, setDeletingItem] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const headers = [
		"ID",
		"Imagen",
		"Nombre",
		"Descripción",
		"Categoría",
		"Características",
		"Acciones",
	];

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = state.data.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(state.data.length / itemsPerPage);

	const handleEdit = (obra) => {
		setEditingItem(obra);
	};

	const handleDelete = (id) => {
		setDeletingItem(id);
	};

	// Función para confirmar la eliminación
	const confirmDelete = async() => {
		try {
			await obrasService.deleteObra(deletingItem);
			// Enviar acción de eliminación al dispatch
			dispatch({ type: "DELETE_ART", payload: { id: deletingItem } });
			setSuccessMessage("El producto se ha eliminado correctamente");
			setDeletingItem(null);
		} catch (error) {
			// Manejo de errores si algo falla al eliminar la obra
			console.error("Error al eliminar la obra:", error);
			setErrorMessage("Ocurrió un error al eliminar el producto. Por favor, intenta de nuevo.");
		}
	};

	// Efecto para ocultar los mensajes después de unos segundos
	useEffect(() => {
		if (successMessage || errorMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage(""); // Ocultar el mensaje de éxito
				setErrorMessage(""); // Ocultar el mensaje de error
			}, 3000); // Duración del mensaje en milisegundos

			return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
		}
	}, [successMessage, errorMessage]);

	return (
		<div className="flex flex-col items-center grow max-h-screen pt-28 relative ">
			<div className="rounded-lg border border-gray-200 max-h-screen mt-2">
				{editingItem ? (
					<Form
						edit={true}
						obra={editingItem}
						onClose={() => setEditingItem(null)}
						setSuccessMessage={setSuccessMessage}
						setErrorMessage={setErrorMessage}
					/>
				) : (
					<div className="h-[70vh] w-[75vw] max-w-[75vw] flex flex-col">
						<h3 className="text-center text-white py-4 text-lg font-bold">
							Listado de Obras
						</h3>

						<div
							id="product-table "
							className="overflow-y-scroll overflow-x-hidden w-[75vw]"
						>
							<table className="divide-y-2 divide-gray-200 bg-white text-sm w-[75vw] ">
								<thead>
									<tr>
										{headers.map((header, index) => (
											<th
												key={index}
												className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
											>
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{currentItems.map((obra) => (
										<tr key={obra.id}>
											<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
												{obra.id}
											</td>
											<td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
												{console.log("Obra actual antes de mapear product table:", obra)}
												{console.log("imagenes en product table "+ JSON.stringify(obra.imagenes))}
												{obra.imagenes ? (
													<img
														src={obra.imagenes.find((imagen) => 
															imagen.nombre?.toLowerCase().startsWith("principal"))?.url || 
															obra.imagenes[0]?.url }
														alt={ obra.nombre || "Imagen"	}
														//alt={`Imagen ${index + 1}`}
														className="w-16 h-16 object-cover"
													/>
												) : (
													<span>
														No hay imagen disponible
													</span>
												)}
											</td>
											<td className="break-words whitespace-wrap px-4 py-2 text-gray-700 text-left">
												{obra.nombre ||
													"Nombre no disponible"}
											</td>
											<td className="break-words whitespace-wrap px-4 py-2 text-gray-700 text-left max-w-[15rem]">
												{obra.descripcion 
													? obra.descripcion.split(' ').slice(0, 15).join(' ') + (obra.descripcion.split(' ').length > 15 ? '...' : '')
													: "Descripción no disponible"
												}
											</td>
											<td className="break-words whitespace-wrap px-4 py-2 text-gray-700 text-left max-w-[40rem]">
												{obra.movimientoArtistico
													?.nombre ||
													"Categoría no disponible"}
											</td>
											<td className="word-wrap whitespace-wrap px-4 py-2 text-gray-700 ">
												<div className="flex flex-wrap space-x-2 items-center gap-1">
													<span className="tag tiny-text bg-primary px-2 rounded-xl ml-2 ">
														{obra.tamano ||
															"Tamaño no disponible"}
													</span>
													<span className="tag tiny-text bg-primary px-2 rounded-xl">
														{priceRangeCalculator(
															obra.precioRenta, state.data
														)}
													</span>
													<span className="tag tiny-text bg-primary px-2 rounded-xl ">
														{obra.tecnicaObra
															?.nombre ||
															"Técnica no disponible"}
													</span>

													<span className="tag tiny-text bg-primary px-2 rounded-xl">
														{obra.fechaCreacion
															? roundToNearest50(
																	parseInt(
																		obra.fechaCreacion.split(
																			"-"
																		)[0]
																	)
															  )
															: "Fecha no disponible"}
													</span>
												</div>
											</td>
											<td className="whitespace-nowrap px-4 flex grow gap-2 py-2 text-left">
												<button
													onClick={() =>
														handleEdit(obra)
													}
													className="text-orange text-lg font-bold p-3 border-orange-600 border-2 rounded hover:bg-orange-600/75 hover:text-white hover:border-orange-400"
												>
													<CiEdit />
												</button>
												<button
													onClick={() =>
														handleDelete(obra.id)
													}
													className="text-red text-lg font-bold p-3 border-red-600 border-2 rounded hover:bg-red-600/75 hover:text-white hover:border-red-400"
												>
													<CiTrash />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<Pagination
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
						/>
					</div>
				)}
			</div>

			{/* Mostrar mensajes */}
			{successMessage && (
				<div className="fixed bottom-16 right-4 z-50 mb-4">
					<Message
						type="success"
						text={successMessage}
						onClose={() => setSuccessMessage("")}
					/>
				</div>
			)}
			{errorMessage && (
				<div className="fixed bottom-4 right-4 z-50 mb-4">
					<Message
						type="danger"
						text={errorMessage}
						onClose={() => setErrorMessage("")}
					/>
				</div>
			)}

			{/* Modal de confirmación de eliminación */}
			{deletingItem && (
				<Modal
					type="delete"
					text="¿Realmente deseas eliminar este elemento? Esta acción no se puede deshacer."
					options={{
						confirmText: "Eliminar",
						cancelText: "Cancelar",
					}}
					isOpen={!!deletingItem}
					onClose={() => setDeletingItem(null)}
					onConfirm={confirmDelete}
				/>
			)}
		</div>
	);
};

export default ProductTable;
