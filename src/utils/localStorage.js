export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
  
// export const loadFromLocalStorage = (key) => {
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : null;
// };

export const loadFromLocalStorage = (key) => {
  const stored = localStorage.getItem(key);
  
  // Verifica si `stored` es "undefined" como cadena o está vacío
  if (stored === "undefined" || stored === null || stored === "") {
    return null;  // Retorna null si no hay un valor válido
  }

  try {
    return JSON.parse(stored); // Intenta parsear el JSON
  } catch (error) {
    console.error(`Error al parsear ${key} desde localStorage`, error);
    return null; // Retorna null si ocurre un error en el parseo
  }
};



  
  export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  
  export const clearLocalStorage = () => {
    localStorage.clear();
  };
  

  export const enqueueFavoriteAction = (action) => {
    const queue = loadFromLocalStorage("favoriteQueue") || [];
    queue.push(action);
    saveToLocalStorage("favoriteQueue", queue);
};

export const dequeueFavoriteAction = () => {
    const queue = loadFromLocalStorage("favoriteQueue") || [];
    const action = queue.shift();
    saveToLocalStorage("favoriteQueue", queue);
    return action;
};

export const getFavoriteQueue = () => {
    return loadFromLocalStorage("favoriteQueue") || [];
};
