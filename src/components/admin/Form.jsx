import { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useContextGlobal } from "../../utils/global.context"; // Importa el contexto
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import Message from "./Message";
import { removeFromLocalStorage } from "../../utils/localStorage";
import { obrasService } from "../../api/services"
import { useCategories } from '../../hooks/useCategories';

const Form = ({ edit, obra = {}, onClose }) => {
	const { state, dispatch } = useContextGlobal(); // Obtiene las categorías del estado global
	const initialFormData = {
		nombre: "",
		descripcion: "",
		disponibilidad: true,
		tecnicaObra: { nombre: "" },
		artista: { nombre: "" },
		movimientoArtistico: { nombre: "" },
	};

	const [formData, setFormData] = useState(
		edit ? { ...obra } : initialFormData
	);
	const [priceRangeSymbol, setPriceRangeSymbol] = useState("");
	const [isAddingCategory, setIsAddingCategory] = useState(false); // Nuevo estado para manejar la creación de categoría
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isCategoryLoading, setIsCategoryLoading] = useState(false);

	// useEffects
	useEffect(() => {
    if (edit && obra) {
        const formattedObra = {
            ...obra,
            imagenes: obra.imagenes || [] // Asegurarse de que siempre haya un array
        };
        setFormData(formattedObra);
        updatePriceRangeSymbol(obra.precioRenta || "");
    }
}, [edit, obra]);

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage("");
			}, 2000); // El mensaje desaparecerá después de 2 segundos

			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage("");
			}, 2000); // El mensaje de error desaparecerá después de 2 segundos

			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

	const onFilesAdded = (files) => {
		setFormData((prevData) => ({
			...prevData,
			imagenesAdicionales: files
		}));
	};

	const onFilesDeleted = (deletedImageId) => {  
		setFormData(prevData => ({
			...prevData,
			imagenes: prevData.imagenes.filter(img => img.id !== deletedImageId)
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "precioRenta") {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
			updatePriceRangeSymbol(value);
		} else if (name.includes(".")) {
			const [parent, child] = name.split(".");
			setFormData((prevData) => ({
				...prevData,
				[parent]: {
					...prevData[parent],
					[child]: value,
				},
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const { 
		newCategory,
		handleInputChange: handleCategoryInputChange,
		submitCategory,
		isLoading: categoryLoading
	} = useCategories((createdCategory) => {
		setFormData(prevData => ({
			...prevData,
			movimientoArtistico: {
				id: createdCategory.id,
				nombre: createdCategory.nombre
			}
		}));
		setIsAddingCategory(false);
		setSuccessMessage("Categoría creada exitosamente");
	});

	const updatePriceRangeSymbol = (value) => {
		if (!value) {
			setPriceRangeSymbol("");
		} else if (value < 100) {
			setPriceRangeSymbol("$");
		} else if (value < 500) {
			setPriceRangeSymbol("$$");
		} else {
			setPriceRangeSymbol("$$$");
		}
	};

	//Función para "aplanar" el objeto formData
	const flattenFormData = (data) => {
    const flattened = {};

		// Asegurarnos de que el ID del movimiento artístico se mantenga
    if (data.movimientoArtistico?.id) {
			flattened['movimientoArtistico.id'] = data.movimientoArtistico.id;
		}

    // Resto de los campos
    Object.keys(data).forEach(key => {
			if (key !== 'movimientoArtistico') {
					if (typeof data[key] === 'object' && data[key] !== null) {
							Object.keys(data[key]).forEach(subKey => {
									flattened[`${key}.${subKey}`] = data[key][subKey];
							});
					} else {
							flattened[key] = data[key];
					}
			}
		});

    return flattened;
};

	const handleSubmit = async(e) => {
		e.preventDefault();
		if (isLoading) return;

		// Verificar si se ha seleccionado o creado una categoría
		const isCategoryValid =
			formData.movimientoArtistico?.nombre ||
			(isAddingCategory && newCategory.nombre);

		const existingProduct = state.data.find(
			(product) => product.nombre === formData.nombre
		);

		if (!edit && existingProduct) { 
			setErrorMessage("El nombre del producto ya existe.");
			console.log("El nombre del producto ya existe.");
			return;
		}
		if (!isCategoryValid) {
			setErrorMessage("Por favor, seleccione o cree una categoría.");
			console.log("Por favor, seleccione o cree una categoría.");
			return;
		}
		console.log("Form data:", formData);

		setIsLoading(true);
		try {
			// Aplanar los datos para el envío a Backend
			const flattenedData = flattenFormData(formData);
			const files = formData.imagenesAdicionales || []; //Nuevas imágenes a subir
			console.log("Flattened data:", flattenedData);

			// Llamar al servicio para actualizar la obra
			if (edit) {
				const formDataToSend = new FormData();

				// Solo enviar los campos necesarios
				const requiredFields = {
					'id': formData.id,
					'nombre': formData.nombre,
					'descripcion': formData.descripcion,
					'fechaCreacion': formData.fechaCreacion,
					'precioRenta': formData.precioRenta,
					'disponibilidad': formData.disponibilidad,
					'tamano': formData.tamano,
					'tecnicaObra.nombre': formData.tecnicaObra?.nombre,
					'artista.nombre': formData.artista?.nombre,
					'movimientoArtistico.id': formData.movimientoArtistico?.id
				};
				
				// Agregar solo los campos necesarios
				Object.entries(requiredFields).forEach(([key, value]) => {
					if (value !== undefined) {
							formDataToSend.append(key, value);
					}
				});

				// Agregar estos logs para debug
				console.log("Estado inicial de formData:", formData);
				console.log("Imágenes antes de procesar:", formData.imagenes);

				// Manejar imagenes existentes
				if (formData.imagenes?.length > 0) {
					formData.imagenes.forEach((imagen, index) => {
						if (imagen?.id) {
							// Crear un nuevo Blob/File para la imagen existente
							const imageBlob = new Blob([''], { type: 'application/octet-stream' });
							const imageFile = new File([imageBlob], imagen.imagenId, { type: 'application/octet-stream' });
							
							formDataToSend.append( `files[${index + 1}].${imagen.imagenId}`, imageFile);
							console.log(`Agregando imagen existente: files[${index + 1}].${imagen.imagenId}`);
						}
					});
				}

				// Manejar nuevas imágenes
				const newImages = formData.imagenesAdicionales || [];
				const startIndex = formData.imagenes?.length || 0 + 1; // Comenzar después de las existentes
				console.log("Nuevas imágenes:", newImages);
				newImages.forEach((file, index) => {
						if (file instanceof File) {
							formDataToSend.append(`files[${startIndex + index}]`, file);
						}
				});

				console.log("Estado de formData:", formData);
				console.log("Imágenes existentes:", formData.imagenes);
				console.log("Imágenes nuevas:", formData.imagenesAdicionales);

				console.log("Sending update data:", Object.fromEntries(formDataToSend));
				const response = await obrasService.updateObra(formDataToSend);
				dispatch({ type: "UPDATE_ART", payload: response });
				setSuccessMessage("La obra se ha actualizado correctamente.");
				setTimeout(() => {
					onClose();
				}, 1500); // Esperar 1.5 segundos antes de cerrar
			} else {
					// Crear nueva obra y guardar en el estado global
					const response = await obrasService.createObra(flattenedData, files); 
					dispatch({ type: "ADD_ART", payload: response });
					setFormData(initialFormData); // Restablecer el formulario
					removeFromLocalStorage("images"); // Eliminar las imágenes del localStorage
					
					setSuccessMessage(
						edit
							? "La obra se ha editado correctamente."
							: "La obra se ha creado correctamente."
					);
					setTimeout(() => {
						onClose();
					}, 1500); 
			};
		}
		catch (error) {
			console.error("Error al enviar los datos al backend:", error);
			setErrorMessage(
					"Hubo un error al enviar los datos. Por favor, inténtalo de nuevo."
			);
		} finally {
			setIsLoading(false);
		}
	}

	const handleCategorySelect = (e) => {
		const { value } = e.target;
		if (value === "agregar") {
			setIsAddingCategory(true);
		} else {
			setIsAddingCategory(false);
			// Encontrar la categoría seleccionada del estado global
			const selectedCategory = state.categories.find(cat => cat.nombre === value);
			
			// Guardar el ID del movimiento artístico seleccionado
			setFormData((prevData) => ({
				...prevData,
				movimientoArtistico: {
					id: selectedCategory?.id, // Guardar el ID del movimiento artístico seleccionado
					nombre: value || "", // Asegúrate de que el valor esté siempre definido
				},
			}));
		}
	};

	const fieldsToRender = edit
		? Object.keys(obra).filter(
				(field) =>
					//field !== "img" &&
					field !== "id" &&
					field !== "tecnicaObra" &&
					field !== "movimientoArtistico" &&
					field !== "artista" &&
					field !== "precioRenta" &&
					field !== "fechaCreacion" &&
					field !== "tamano" &&
					field !== "imagenesAdicionales"
		  )
		: Object.keys(initialFormData).filter(
				(field) =>
					field !== "tecnicaObra" &&
					field !== "movimientoArtistico" &&
					field !== "artista"
		  );

	const renderFields = (fields) => {
		return fields.map((field) => {
			const fieldValue = formData[field] || "";
			const fieldType =
				field === "descripcion"
					? "textarea"
					: field === "disponibilidad"
					? "select"
					: field === "fechaCreacion"
					? "date"
					: field === "imagenes"
					? "imagen"
					: "input";

			return (
				<FormField
					key={field}
					element={fieldType}
					name={field}
					value={fieldValue}
					onChange={handleChange}
					label={field}
				>
					{fieldType === "select" && (
						<>
							<option value="true">Sí</option>
							<option value="false">No</option>
						</>
					)}
				</FormField>
			);
		});
	};

	const renderNestedFields = () => {
		return (
			<>
				<fieldset className="border border-primary p-3 mt-4 rounded">
					<legend className="text-sm font-semibold">
						Características
					</legend>
					<div className="flex items-center space-x-4 justify-between w-full">
						<div className="flex items-center w-1/2">
							<FormField
								element="input"
								name="precioRenta"
								value={formData.precioRenta}
								onChange={handleChange}
								label="Precio Renta"
							/>
							{priceRangeSymbol && (
								<span className="ml-2 bg-green-600 text-white px-2 py-1 rounded mt-2">
									{priceRangeSymbol}
								</span>
							)}
						</div>
						<div className="w-1/2">
							<FormField
								element="date"
								name="fechaCreacion"
								value={formData.fechaCreacion}
								onChange={handleChange}
								label="Fecha Creación"
							/>
						</div>
					</div>
					<FormField
						element="select"
						name="tamano"
						value={formData.tamano}
						onChange={handleChange}
						label="Tamaño"
					>
						<option value="">Seleccione un tamaño</option>
						<option value="GRANDE">GRANDE</option>
						<option value="MEDIANO">MEDIANO</option>
						<option value="PEQUEÑO">PEQUEÑO</option>
					</FormField>
					{[
						{
							label: "Técnica",
							name: "tecnicaObra.nombre",
							value: formData.tecnicaObra?.nombre || "",
						},
						{
							label: "Artista",
							name: "artista.nombre",
							value: formData.artista?.nombre || "",
						},
					].map(({ label, name, value }) => (
						<FormField
							key={name}
							element="input"
							name={name}
							value={value}
							onChange={handleChange}
							label={label}
						/>
					))}
				</fieldset>

				<fieldset className="border border-primary p-3 mt-4 rounded">
					<legend className="text-sm font-semibold">Categoría</legend>
					<FormField
						element="select"
						name="movimientoArtistico.nombre"
						value={formData.movimientoArtistico?.nombre || ""}
						onChange={handleCategorySelect} // Cambié esto para que se active el "agregar nueva categoría"
						label="Movimiento Artístico"
					>
						<option value="">Seleccione un movimiento</option>
						{state.categories.map((category) => (
							<option 
								key={category.id} 
								value={category.nombre}
							>
								{category.nombre}
							</option>
						))}
						<option value="agregar">Agregar nueva categoría</option>
					</FormField>

					{isAddingCategory && (
						<div className="mt-4">
							<FormField
								element="input"
								name="nombre"
								value={newCategory.nombre}
								onChange={handleCategoryInputChange}
								label="Nombre de la nueva categoría"
							/>
							<FormField
								element="textarea"
								name="descripcion"
								value={newCategory.descripcion}
								onChange={handleCategoryInputChange}
								label="Descripción de la nueva categoría"
							/>
							<div className="mb-4">
								<label className="block text-sm font-semibold mb-2">
									Imagen
								</label>
								<div className="flex gap-4 items-center">
									<input
										type="file"
										name="imagen"
										accept="image/*"
										onChange={handleCategoryInputChange}
										className="w-full p-2 border border-gray-300 rounded"
									/>
									{newCategory.previewUrl && (
										<img
											src={newCategory.previewUrl}
											alt="Vista previa"
											className="w-20 h-20 object-cover rounded"
										/>
									)}
								</div>
							</div>
							<button
								type="button"
								className="bg-blue-600 text-white py-2 px-4 mt-2 rounded disabled:opacity-50 flex items-center gap-2"
								onClick={async (e) => {
									try {
										await submitCategory(e);
									} catch (error) {
										setErrorMessage(error.message);
									}
								}}
								disabled={categoryLoading}
							>
								{categoryLoading ? (
									<>
										<FaSpinner className="animate-spin" />
										Creando categoría...
									</>
								) : (
									"Crear Categoría"
								)}
							</button>
						</div>
					)}
				</fieldset>
			</>
		);
	};

	return (
		<div className="w-[75vw] h-[65vh] overflow-y-scroll relative bg-white p-6 rounded-lg shadow-md">
			<button
				onClick={onClose}
				className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
				aria-label="Cerrar"
			>
				<FaTimes />
			</button>
			<h2 className="text-xl font-semibold mb-4">
				{edit ? "Editar obra" : "Crear nueva obra"}
			</h2>
			<form onSubmit={handleSubmit}>
				{renderFields(fieldsToRender)}
				{renderNestedFields()}
				<ImageUpload
					artId={formData.id} // Reemplazar art.id con formData.id
					existingImages={formData.imagenes} 
					onFilesAdded={onFilesAdded}
					onFilesDeleted={onFilesDeleted}
				/>

				<div className="flex justify-between items-center">
					<button
						type="button"
						className="bg-gray-500 text-white py-2 px-4 rounded mt-4 disabled:opacity-50"
						onClick={onClose}
						disabled={isLoading}
					>
						Cancelar
					</button>
					<button
						type="submit"
						className="bg-blue-600 text-white py-2 px-4 rounded mt-4 disabled:opacity-50 flex items-center gap-2"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<FaSpinner className="animate-spin" />
								{edit ? "Actualizando obra..." : "Creando obra..."}
							</>
						) : (
							edit ? "Actualizar obra" : "Crear obra"
						)}
					</button>
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
			</form>
		</div>
	);
};

export default Form;