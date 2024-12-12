// utils/formatFunctions.js

const formatLabel = (fieldName) => {
	return fieldName
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Inserta un espacio entre la letra minúscula y la mayúscula
		.replace(/([A-Z])/g, " $1") // Agrega un espacio antes de cada letra mayúscula
		.trim() // Elimina espacios al principio y al final
		.replace(/^./, (str) => str.toUpperCase()); // Capitaliza la primera letra
};

const formatDate = (dateString) => {
	if (!dateString) return ""; // Verifica si la fecha está vacía o es nula

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return ""; // Verifica si es una fecha inválida

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

const idCreator = (elementos) => {
	const ids = elementos
		.filter((elemento) => elemento.hasOwnProperty("id"))
		.map((elemento) => elemento.id);

	// AUTOINCREMENTAR
	const maxId = ids.length > 0 ? Math.max(...ids) : 0;
	console.log("id: "+maxId + 1)
	return maxId + 1;
};

const priceRangeCalculator = (precioRenta, data) => {
	const precios = data
		.filter((obra) => obra.precioRenta)
		.map((obra) => obra.precioRenta);

	if (precios.length === 0) {
		return "Precio no disponible";
	}

	const minPrice = Math.min(...precios);
	const maxPrice = Math.max(...precios);
	const avgPrice = (minPrice + maxPrice) / 2;

	if (precioRenta <= minPrice + (maxPrice - minPrice) * 0.3) {
		return "$"; // Precio bajo
	} else if (precioRenta <= minPrice + (maxPrice - minPrice) * 0.7) {
		return "$$"; // Precio medio
	} else {
		return "$$$"; // Precio alto
	}
};

const roundToNearest50 = (year) => {
	// Se calcula el múltiplo de 50 más cercano al año
	const remainder = year % 50;
	if (remainder < 25) {
		// Si el resto es menor que 25, redondeamos hacia abajo
		return year - remainder;
	} else {
		// Si el resto es mayor o igual que 25, redondeamos hacia arriba
		return year + (50 - remainder);
	}
};


// Exportar ambas funciones
export { formatLabel, formatDate, idCreator, priceRangeCalculator, roundToNearest50 };
