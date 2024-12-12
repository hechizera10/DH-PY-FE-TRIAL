import React, { useState, useEffect } from "react";
import { useContextGlobal } from "../../utils/global.context";

const ImageUpload = ({ onFilesAdded, onFilesDeleted, existingImages, imagenesAdicionales }) => {
    const [localImages, setLocalImages] = useState([]); // Nuevo estado local

    // Reinicializar el estado cuando cambian las imágenes adicionales
    useEffect(() => {
        // Limpiar URLs de objeto al desmontar
        return () => {
            localImages.forEach(img => {
                if (!img.isExisting) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [localImages]); 

     // Inicializar imágenes cuando se reciben imagenesAdicionales
     useEffect(() => {

        const initialImages = [];
        
        // Procesar imágenes existentes si las hay
        if (existingImages && existingImages.length > 0) {
            const existingFormattedImages = existingImages.map(img => ({
                url: img.url || img,
                file: null,
                isExisting: true,
                imagenId: img.id || img.imagenId
            }));
            initialImages.push(...existingFormattedImages);
        }

        // Procesar imágenes adicionales si las hay
        if (imagenesAdicionales && imagenesAdicionales.length > 0) {
            const additionalFormattedImages = imagenesAdicionales.map(img => ({
                url: img.url || (typeof img === 'string' ? img : URL.createObjectURL(img)),
                file: img.file || (typeof img === 'string' || img.imagenId ? null : img),
                isExisting: img.isExisting || typeof img === 'string' || img.imagenId ? true : false,
                imagenId: img.imagenId || null
            }));
            initialImages.push(...additionalFormattedImages);
        }

        setLocalImages(initialImages);

        // Cleanup function
        return () => {
            initialImages.forEach(img => {
                if (!img.isExisting && img.url) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [existingImages, imagenesAdicionales]);


    const handleFileChange = (e) => {
        e.stopPropagation();
        const newFiles = Array.from(e.target.files);
        const updatedImages = [...localImages];
        
        newFiles.forEach(file => {
            const isDuplicate = localImages.some(img => 
                img.file && img.file.name === file.name && img.file.size === file.size
            );

            if (!isDuplicate) {
                const fileUrl = URL.createObjectURL(file);
                updatedImages.push({
                    url: fileUrl,
                    file: file,
                    isExisting: false
                });
            }
        });

        setLocalImages(updatedImages);

        const allFiles = updatedImages.map(img => {
            if (img.isExisting) {
                return img.imagenId ? { imagenId: img.imagenId } : img.url;
            }
            return img.file;
        });
        onFilesAdded(allFiles);

        
        e.target.value = '';
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Crear una copia del estado actual
        let currentImages = [...localImages];
        
        // Procesar todos los archivos
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            const isDuplicate = currentImages.some(img => 
                img.file && img.file.name === file.name && img.file.size === file.size
            );

            if (!isDuplicate) {
                const fileUrl = URL.createObjectURL(file);
                currentImages.push({
                    url: fileUrl,
                    file: file,
                    isExisting: false
                });
            }
        }

        // Actualizar el estado con todos los archivos
        setLocalImages(currentImages);
        
        // Notificar al componente padre
        const allFiles = currentImages.map(img => {
            if (img.isExisting) {
                return img.imagenId ? { imagenId: img.imagenId } : img.url;
            }
            return img.file;
        });
        onFilesAdded(allFiles);
    };

    const handleDelete = (imageToDelete) => {
        const newLocalImages = localImages.filter(img => img.url !== imageToDelete.url);
        setLocalImages(newLocalImages);
        
        if (!imageToDelete.isExisting) {
            URL.revokeObjectURL(imageToDelete.url);
        } else if (imageToDelete.imagenId) {
            onFilesDeleted?.(imageToDelete.imagenId); // Llamar a la nueva función si existe
        }
        
        // Notificar al componente padre preservando los IDs
        const updatedFiles = newLocalImages.map(img => {
            if (img.isExisting) {
                return img.imagenId ? { imagenId: img.imagenId } : img.url;
            }
            return img.file;
        });
        onFilesAdded(updatedFiles);
    };

    const addFile = (file) => {
        const isDuplicate = localImages.some(img => 
            img.file && img.file.name === file.name && img.file.size === file.size
        );

        if (!isDuplicate) {
            const fileUrl = URL.createObjectURL(file);
            const newImage = {
                url: fileUrl,
                file: file,
                isExisting: false
            };
            
            const updatedImages = [...localImages, newImage];
            setLocalImages(updatedImages);
            
            // Notificar al componente padre
            const allFiles = updatedImages.map(img => {
                if (img.isExisting) {
                    return img.imagenId ? { imagenId: img.imagenId } : img.url;
                }
                return img.file;
            });
            onFilesAdded(allFiles);
        }
    };


    return (
        <div
            className="mt-4 border-2 border-dashed border-gray-400 py-12 flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} 
            onClick={(e) => e.stopPropagation()}
        >
            <p className="mb-3 font-semibold text-gray-900">Arrastra y suelta tus archivos aquí o</p>
            <input
                id="hidden-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()} 
            />
            <button
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById("hidden-input").click();
                }}
            >
                Cargar un archivo
            </button>
            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">Imágenes</h1>
            <ul className="flex flex-wrap m-1 w-full justify-center align-center gap-2">
                {localImages.length === 0 ? (
                    <li className="h-full w-full text-center flex flex-col items-center justify-center">
                        <img
                            className="mx-auto w-32"
                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                            alt="no data"
                        />
                        <span className="text-small text-gray-500">No hay archivos seleccionados</span>
                    </li>
                ) : (
                    localImages.map((image, index) => {
                        // Si el archivo es en bruto, creamos una URL local para la vista previa
                        //const imageUrl = image?.url ? image.url : URL.createObjectURL(image);

                        return (
                            <li key={`${image.url}-${index}`} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24 relative">
                                <article className="group w-full h-full rounded-md bg-gray-100 cursor-pointer relative shadow-sm">
                                    <img
                                        alt="preview"
                                        className="img-preview w-full h-full object-cover rounded-md"
                                        src={image.url} // Usar imageUrl para asegurarte de que siempre se pasa la URL correcta
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-600 bg-gray-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(image); // Elimina usando la URL correcta
                                        }}
                                    >
                                        X
                                    </button>
                                </article>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default ImageUpload;
