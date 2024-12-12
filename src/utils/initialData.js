import data from "./data.json";
import { obrasService } from "../api/services";

async function insertarObras(obras, servicio) {
	// Itera sobre cada obra en el array de obras
	for (const obra of obras) {
		try {
			// Las imágenes adicionales
			const archivos = [obra.img, ...obra.imagenesAdicionales];

			// Llamar al servicio createObra con los datos de la obra y las imágenes
			const response = await servicio.createObra(obra, archivos);

			console.log(
				`Obra ${obra.nombre} insertada correctamente.`,
				response
			);
		} catch (error) {
			console.error(`Error al insertar la obra ${obra.nombre}:`, error);
		}
	}
}

