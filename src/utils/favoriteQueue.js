const FAVORITE_QUEUE_KEY = "favoriteQueue";

export const enqueueFavoriteAction = (action) => {
	const queue = JSON.parse(localStorage.getItem(FAVORITE_QUEUE_KEY)) || [];
	queue.push(action);
	localStorage.setItem(FAVORITE_QUEUE_KEY, JSON.stringify(queue));
};

export const processFavoriteQueue = async (dispatch, favoritosService) => {
	const queue = JSON.parse(localStorage.getItem(FAVORITE_QUEUE_KEY)) || [];
	if (queue.length === 0) return;

	const successfulActions = [];
	for (const action of queue) {
		try {
			if (action.type === "ADD") {
				await favoritosService.agregarFavorito(action.productoId);
				dispatch({
					type: "ADD_TO_FAVORITES",
					payload: action.producto,
				});
			} else if (action.type === "REMOVE") {
				await favoritosService.eliminarFavorito(action.productoId);
				dispatch({
					type: "REMOVE_FROM_FAVORITES",
					payload: action.producto,
				});
			}
			successfulActions.push(action);
		} catch (error) {
			console.error(`Error processing action ${action.type}:`, error);
		}
	}

	// Filtrar las acciones exitosas de la cola
	const remainingQueue = queue.filter(
		(action) => !successfulActions.includes(action)
	);
	localStorage.setItem(FAVORITE_QUEUE_KEY, JSON.stringify(remainingQueue));
};
