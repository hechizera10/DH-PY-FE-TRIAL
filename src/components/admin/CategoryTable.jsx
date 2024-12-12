import { useContextGlobal } from "../../utils/global.context";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Modal from "./Modal";
import Message from "./Message";
import { FaTimes } from "react-icons/fa"; 
import { categoriaService } from "../../api/categoriaService";

const CategoryTable = () => {
  const { state, dispatch } = useContextGlobal();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const headers = ["ID", "Imagen", "Titulo", "Descripción"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = state.categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(state.categories.length / itemsPerPage);
  //console.log(editingItem.imagen.url);

  const handleEdit = (categoria) => {
    setEditingItem(categoria);
  };

  const handleDelete = (id) => {
    setDeletingItem(id);
  };

  const confirmDelete = async() => {
    try {
      await categoriaService.deleteCategoria(deletingItem);
      dispatch({ type: "DELETE_CATEGORY", payload: { id: deletingItem } });
      setSuccessMessage("La categoría se ha eliminado correctamente");
      setDeletingItem(null);  
    } catch (error) {
      setDeletingItem(null);
      if (error.message) {
        setErrorMessage(error.message); // Si el backend envió un mensaje de error, lo mostramos
      } else {
        setErrorMessage("Hubo un error al eliminar la categoría.");
      }
  }
  };

  const handleSaveEdit = async(updateCategory) => {
    // Obtener las categorías existentes
    const response = await categoriaService.getCategorias();
    const existingCategories = response;

   // Verificar si la categoría ya existe
   const duplicateCategory = existingCategories.find(existingCategory => {
    const isSameName = existingCategory.nombre.toLowerCase() === updateCategory.nombre.toLowerCase();
    const isDifferentId = existingCategory.id !== updateCategory.id;
    
    return isSameName && isDifferentId;
    });

    if (duplicateCategory) {
        setErrorMessage("El nombre de la categoría que intenta actualizar ya existe.");
        return; 
    }

    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('id', updateCategory.id);
    formData.append('nombre', updateCategory.nombre);
    formData.append('descripcion', updateCategory.descripcion);
    
    // Si hay una imagen existente, enviar su ID
    if (updateCategory.imagen?.id) {
      formData.append(`files[0].${updateCategory.imagen.id}`, '');
    }

    // Si hay una nueva imagen (File), agregarla al FormData
    if (updateCategory.newImage instanceof File) {
        formData.append('file', updateCategory.newImage);
    }

     // Para debugging - ver qué se está enviando
     for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const updatedCat =await categoriaService.updateCategoria(formData)
    console.log("categoría a actualizar: ", updatedCat)
    dispatch({ type: "UPDATE_CATEGORY", payload: updatedCat });
    setSuccessMessage("Categoría actualizada con éxito");
    setEditingItem(null);
  };

 
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(""); 
        setErrorMessage(""); 
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="flex flex-col items-center grow max-h-screen pt-28 relative">
      <div className="rounded-lg border border-gray-200 max-h-screen mt-2">
        {editingItem ? (
          // Formulario de edición sobre la tabla
          <div className="w-[75vw] h-[70vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-md relative">
            {/* Botón de cierre */}
            <button
              onClick={() => setEditingItem(null)} // Cerrar el formulario de edición
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(editingItem);
              }}
              
            >
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="nombre">Nombre de la categoría</label>
                <input
                  type="text"
                  id="nombre"
                  value={editingItem.nombre}
                  onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  value={editingItem.descripcion || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, descripcion: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="imagen">Imagen</label>
                <div className="flex flex-col gap-4">
                    {/* Mostrar imagen actual */}
                    {editingItem.imagen?.url && (
                        <div className="flex items-center gap-2">
                            <img
                                src={editingItem.imagen.url}
                                alt="Imagen actual"
                                className="w-20 h-20 object-cover rounded"
                            />
                            <span className="text-sm text-gray-500">Imagen actual</span>
                        </div>
                    )}
                    
                    {/* Input para nueva imagen */}
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            name="newImage"
                            id="newImage"
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setEditingItem(prev => ({
                                        ...prev,
                                        newImage: file,
                                        previewUrl: URL.createObjectURL(file)
                                    }));
                                }
                            }}
                        />
                        {/* Vista previa de la nueva imagen */}
                        {editingItem.previewUrl && (
                            <div className="flex items-center gap-2">
                                <img
                                    src={editingItem.previewUrl}
                                    alt="Vista previa"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <span className="text-sm text-gray-500">Nueva imagen</span>
                            </div>
                        )}
                    </div>
                </div>

              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => setEditingItem(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Tabla de categorías cuando no se está editando
          <div className="h-[70vh] w-[75vw] max-w-[75vw] flex flex-col">
            <h3 className="text-center text-white py-4 text-lg font-bold">Listado de Categorías</h3>
            <div id="category-table" className="overflow-y-scroll overflow-x-hidden w-[75vw]">
              <table className="divide-y-2 divide-gray-200 bg-white text-sm w-[75vw]">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((categoria) => (
                    <tr key={categoria.id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">{categoria.id}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
                        <img src={categoria.imagen.url} alt={categoria.nombre || "Imagen"} className="w-16 h-16 object-cover" />
                      </td>
                      <td className="break-words whitespace-wrap px-4 py-2 text-gray-700 text-left">{categoria.nombre || "Nombre no disponible"}</td>
                      <td className="break-words whitespace-wrap px-4 py-2 text-gray-700 text-left max-w-[40rem]">{categoria.descripcion || "Descripción no disponible"}</td>
                      <td className="whitespace-nowrap px-4 flex grow gap-2 py-2 text-left">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="text-orange text-lg font-bold p-3 border-orange-600 border-2 rounded hover:bg-orange-600/75 hover:text-white hover:border-orange-400"
                        >
                          <CiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.id)}
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
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
          </div>
        )}
      </div>

      {/* Mostrar mensajes */}
      {successMessage && (
        <div className="fixed bottom-16 right-4 z-50 mb-4">
          <Message type="success" text={successMessage} onClose={() => setSuccessMessage("")} />
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 z-50 mb-4">
          <Message type="danger" text={errorMessage} onClose={() => setErrorMessage("")} />
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingItem && (
        <Modal
          type="delete"
          text={`¿Realmente deseas eliminar ${state.categories.find(cat => cat.id === deletingItem)?.nombre || 'esta categoría'}? Esta acción no se puede deshacer.`}
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

export default CategoryTable;
