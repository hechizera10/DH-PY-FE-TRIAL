// hooks/useFavoriteSync.js
import { useEffect } from "react";
import { processFavoriteQueue } from "../utils/favoriteQueue";
import { favoritosService } from "../api/favoritosService";

const useFavoriteSync = (dispatch) => {
	useEffect(() => {
		const interval = setInterval(() => {
			processFavoriteQueue(dispatch, favoritosService);
		}, 5000);

		return () => clearInterval(interval);
	}, [dispatch]);
};

export default useFavoriteSync;
