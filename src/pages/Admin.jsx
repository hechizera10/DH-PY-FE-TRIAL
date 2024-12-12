import { useContextGlobal } from "../utils/global.context";
import SubHeader from "../components/SubHeader";
import ProductTable from "../components/admin/ProductTable";
import UserTable from "../components/admin/UserTable";
import CategoryTable from "../components/admin/CategoryTable";
import IsMobile from "../components/admin/IsMobile";
import { useState, useEffect  } from "react";
import Sidebar from "../components/admin/Sidebar";
import Form from "../components/admin/Form";
import { FaTimes, FaSpinner } from "react-icons/fa";
import Message from "../components/admin/Message";
import { authService } from "../api/authService";
import { userService } from "../api/userService";
import { useCategories } from '../hooks/useCategories';

const Admin = () => {
	const { isMobile, state, dispatch } = useContextGlobal();
	const [isCreatingItem, setIsCreatingItem] = useState(null); // Maneja qué formulario se está mostrando (producto, usuario o categoría)
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [newUser, setNewUser] = useState({
		name: "",
		lastname: "",
		email: "",
		password: "password",
	});
	const [isCategoryLoading, setIsCategoryLoading] = useState(false);
	const [isUserLoading, setIsUserLoading] = useState(false);

	// Crear una nueva categoría
	const { 
		newCategory: newCat,                     // renombramos 
		handleInputChange: handleInputChangeCat, // renombramos
		submitCategory,                           // usamos tal cuál
		setNewCategory    // Solo agregamos esta línea
	} = useCategories(() => {                  // pasamos una función callback que se ejecutará al tener éxito                 
		handleListItems();
		setSuccessMessage("Categoría creada con éxito");
	});
	
	const handleAddItem = (itemType) => {
		setIsCreatingItem(itemType); // Establece el tipo de ítem que se va a crear
	};

	const handleListItems = () => {
		setIsCreatingItem(null); // Vuelve a la vista de lista
	};

	const activeSection = state.activeSection;

	const buttons = {
		obras: [
			{
				text: "Agregar producto",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("producto"),
			},
			{
				text: "Lista de productos",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
		usuarios: [
			{
				text: "Agregar usuario",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("usuario"),
			},
			{
				text: "Lista de usuarios",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
		categorias: [
			{
				text: "Agregar categoría",
				textColor: "primary",
				bgColor: "transparent",
				action: () => handleAddItem("categoria"),
			},
			{
				text: "Lista de categorías",
				textColor: "primary",
				bgColor: "transparent",
				action: handleListItems,
			},
		],
	};

	const buttonsToDisplay = { [activeSection]: buttons[activeSection] || [] };

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewUser({
			...newUser,
			[name]: value,
		});
	};
	// Efecto para ocultar los mensajes después de unos segundos
	useEffect(() => {
		if (successMessage || errorMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage(""); // Ocultar el mensaje de éxito
				setErrorMessage(""); // Ocultar el mensaje de error
			}, 2000); // Duración del mensaje en milisegundos

			return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
		}
	}, [successMessage, errorMessage]);
	
	const handleSubmitUser = async(e) => {
		e.preventDefault();
		if (isUserLoading) return;

		if (!newUser.name || !newUser.lastname || !newUser.email) {
			setErrorMessage("Por favor, complete todos los campos.");
			return;
		}

		// Validación básica del formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newUser.email)) {
			setErrorMessage("Por favor, ingrese un correo electrónico válido.");
			return;
		}

		setIsUserLoading(true);
		try {
			// Obtener la lista actualizada de usuarios antes de verificar
			let existingUsers;
			try {
				existingUsers = await userService.getUsers();
			} catch (error) {
				console.error("Error al verificar usuarios:", error);
				existingUsers = state.users; // Usar el estado global como respaldo
			}
			
			const userExists = existingUsers.some(user => 
				user.email.toLowerCase() === newUser.email.toLowerCase()
			);

			if (userExists) {
				setErrorMessage("Ya existe un usuario con este correo electrónico.");
				setIsUserLoading(false);
				return;
			}

			// Registro del nuevo usuario
			const newUserRegister = {
				name: newUser.name,
				lastname: newUser.lastname,
				email: newUser.email,
				password: "password",
			}
			
			const createdUser = await authService.register(newUserRegister);
			dispatch({ type: "ADD_USER", payload: createdUser });
			setSuccessMessage("Usuario creado con éxito");
			setNewUser({ name: "", lastname: "", email: ""});
			handleListItems();

			// Actualizar la lista de usuarios inmediatamente después de crear uno nuevo
			const updatedUsers = await userService.getUsers();
			dispatch({ type: "GET_USERS", payload: updatedUsers });

		} catch (error) {
			setErrorMessage(error.message || "Hubo un error al crear el usuario. Intente nuevamente.");
		} finally {
			setIsUserLoading(false);
		}
	};

	return (
		<>
			{isMobile ? (
				<IsMobile />
			) : (
				<div className="min-h-screen pt-8 bg-black">
					<SubHeader
						title={"Panel de Administración"}
						buttons={buttonsToDisplay}
					/>
					{isCreatingItem ? (
						<section className="flex w-screen h-screen-28">
							<Sidebar />
							<div className="flex flex-col items-center grow max-h-screen pt-32 relative">
								{isCreatingItem === "producto" && (
									<Form
										edit={false}
										onClose={handleListItems}
										setSuccessMessage={setSuccessMessage}
										setErrorMessage={setErrorMessage}
										
									/>
								)}
								{isCreatingItem === "usuario" && (
									<div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
										<button
											onClick={() => {
												setNewUser({ name: "", lastname: "", email: "", password: "password" });
												handleListItems();
											}}
											className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
											aria-label="Cerrar"
										>
											<FaTimes />
										</button>
										<h2 className="text-xl font-semibold mb-4">
											Crear nuevo usuario
										</h2>
										<form onSubmit={handleSubmitUser}>
											<div className="flex space-x-4 mb-4">
												<div className="flex-1">
													<label
														className="block text-sm font-semibold mb-2"
														htmlFor="name"
													>
														Nombre
													</label>
													<input
														type="text"
														id="name"
														name="name"
														value={newUser.name}
														onChange={
															handleInputChange
														}
														className="w-full p-2 border border-gray-300 rounded"
														required
													/>
												</div>
												<div className="flex-1">
													<label
														className="block text-sm font-semibold mb-2"
														htmlFor="lastname"
													>
														Apellido
													</label>
													<input
														type="text"
														id="lastname"
														name="lastname"
														value={newUser.lastname}
														onChange={
															handleInputChange
														}
														className="w-full p-2 border border-gray-300 rounded"
														required
													/>
												</div>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="email"
												>
													Correo electrónico
												</label>
												<input
													type="email"
													id="email"
													name="email"
													value={newUser.email}
													onChange={handleInputChange}
													className="w-full p-2 border border-gray-300 rounded"
													required
												/>
											</div>
											<div className="flex justify-between">
												<button
													type="button"
													className="bg-gray-500 text-white py-2 px-4 rounded"
													onClick={() => {
														setNewUser({ name: "", lastname: "", email: "", password: "password" });
														handleListItems();
													}}
												>
													Cancelar
												</button>
												<button
													type="submit"
													className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
													disabled={isUserLoading}
												>
													{isUserLoading ? (
														<>
															<FaSpinner className="animate-spin" />
															Creando usuario...
														</>
													) : (
														"Crear Usuario"
													)}
												</button>
											</div>
										</form>
									</div>
								)}
								{isCreatingItem === "categoria" && (
									<div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
										<button
											onClick={() => {
												setNewCategory({ nombre: "", descripcion: "", imagen: null, previewUrl: null });
												handleListItems();
											}}
											className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
											aria-label="Cerrar"
										>
											<FaTimes />
										</button>
										<h2 className="text-xl font-semibold mb-4">
											Crear nueva categoría
										</h2>
										<form onSubmit={async (e) => {
											e.preventDefault();
											if (isCategoryLoading) return;

											setIsCategoryLoading(true);
											try {
												await submitCategory(e);
											} catch (error) {
												setErrorMessage(error.message);
											} finally {
												setIsCategoryLoading(false);
											}
										}}>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="nombre"
												>
													Nombre de la categoría
												</label>
												<input
													type="text"
													id="nombre"
													className="w-full p-2 border border-gray-300 rounded"
													value={newCat.nombre}
													name="nombre"
													onChange={handleInputChangeCat}
												/>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="descripcion"
												>
													Descripción
												</label>
												<textarea
													id="descripcion"
													name="descripcion"
													className="w-full p-2 border border-gray-300 rounded"
													value={newCat.descripcion}
													onChange={handleInputChangeCat}
												/>
											</div>
											<div className="mb-4">
												<label
													className="block text-sm font-semibold mb-2"
													htmlFor="imagen"
												>
													Imagen
												</label>
													<div className="flex gap-4 items-center">
														<input
																type="file"
																name="imagen"
																id="imagen"
																accept="image/*"
																className="w-full p-2 border border-gray-300 rounded"
																onChange={handleInputChangeCat}
														/>
														{newCat.previewUrl && (
																<img
																		src={newCat.previewUrl}
																		alt="Vista previa"
																		className="w-20 h-20 object-cover rounded"
																/>
														)}
													</div>

											</div>
											<div className="flex justify-between">
												<button
													type="button"
													className="bg-gray-500 text-white py-2 px-4 rounded"
													onClick={() => {
														setNewCategory({ nombre: "", descripcion: "", imagen: null, previewUrl: null });
														handleListItems();
													}}
													disabled={isCategoryLoading}
												>
													Cancelar
												</button>
												<button
													type="submit"
													className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 flex items-center gap-2"
													disabled={isCategoryLoading}
													>
													{isCategoryLoading ? (
														<>
															<FaSpinner className="animate-spin" />
															Creando categoría...
														</>
													) : (
														"Crear Categoría"
													)}
												</button>
											</div>
										</form>
									</div>
								)}
							</div>
						</section>
					) : (
						<section className="flex w-screen h-screen-28">
							<Sidebar />
							{activeSection === "obras" && <ProductTable />}
							{activeSection === "usuarios" && <UserTable />}
							{activeSection === "categorias" && (
								<CategoryTable />
							)}
						</section>
					)}
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
				</div>
			)}
		</>
	);
};

export default Admin;