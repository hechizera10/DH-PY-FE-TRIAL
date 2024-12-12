import Button from './Button';
import Calendar from './Calendar';
import { BiSearchAlt } from "react-icons/bi";
import '../styles/App.css';
import { useContextGlobal } from '../utils/global.context';
import { useState, useRef, useEffect } from 'react';
import Card from './Card';
import reservasService from '../api/reservasService';

const Buscador = () => {
  const { state } = useContextGlobal();
  // state.data = [];
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [error, setError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setFilteredOptions([]); // Cierra la lista de sugerencias
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cambia los nombres de categoria y obra para mejorar legibilidad.
  const translations = {
    category: 'categoría',
    art: 'obra',
  };
  
  // Mapeo de obras y categorias en el autocompletado
  const options = [
    // Mapeo de categorías
    ...state.categories.map(category => ({ 
      label: category.nombre, 
      type: translations.category,
      id: category.id 
    })),
    // Mapeo de obras
    ...state.data.map(art => ({ 
      label: art.nombre, 
      type: translations.art,
      id: art.id
    })),
  ];
  

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    setFilteredOptions([]);
  };

  const filterByAvailability = async (artworks) => {
    try {
      if (dateRange[0].startDate.getTime() === dateRange[0].endDate.getTime()) {
        return artworks;
      }

      const fechaInicio = dateRange[0].startDate.toISOString().split('T')[0];
      const fechaFin = dateRange[0].endDate.toISOString().split('T')[0];

      // Obtener las obras disponibles del backend
      const disponibles = await reservasService.obtenerObrasDisponibles(
        fechaInicio,
        fechaFin
      );

      // Filtrar las obras que están en la lista de disponibles
      return artworks.filter(art => 
        disponibles.some(obraDisponible => obraDisponible.id === art.id)
      );
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      setError(true);
      return [];
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setHasSearched(true);
    
    try {
      setError(false);

      if (!state.data || state.data.length === 0) {
        throw new Error('No se pudieron cargar los datos');
      }

      let results = [];
      
      if (inputValue.trim()) {
        const selectedCategory = state.categories.find(
          category => category.nombre.toLowerCase() === inputValue.toLowerCase()
        );
        
        if (selectedCategory) {
          results = state.data.filter(art => 
            art.movimientoArtistico.nombre.toLowerCase() === selectedCategory.nombre.toLowerCase()
          );
        } else {
          results = state.data.filter(art => 
            art.nombre.toLowerCase().includes(inputValue.toLowerCase()) || 
            art.movimientoArtistico.nombre.toLowerCase().includes(inputValue.toLowerCase())
          );
        }
      } else {
        results = state.data;
      }

      // Aplicar el filtro de disponibilidad de manera asíncrona
      const availableResults = await filterByAvailability(results);
      setSelectedArtworks(availableResults);
    } catch (err) {
      setError(true);
      console.error('Error al realizar la búsqueda:', err);
    }
  };

  // La función searchByCategory también necesita ser actualizada para ser asíncrona
  const searchByCategory = async (categoryName) => {
    try {
      setError(false);
      setInputValue(categoryName);
      setHasSearched(true);
      
      if (!state.data || state.data.length === 0) {
        throw new Error('No se pudieron cargar los datos');
      }

      const results = state.data.filter(art => 
        art.movimientoArtistico.nombre.toLowerCase() === categoryName.toLowerCase()
      );

      const availableResults = await filterByAvailability(results);
      setSelectedArtworks(availableResults);
    } catch (err) {
      setError(true);
      console.error('Error al buscar categoría:', err);
    }
  };

  // Exponer la función a través del contexto global
  useEffect(() => {
    if (window) {
      window.searchByCategory = searchByCategory;
    }
  }, []);

  return (
    <section className="flex-col items-center justify-center w-full pt-32 mx-auto text-center bg-secondary p-7 search-section">
      <h1 className="mt-16 font-serif text-4xl leading-relaxed text-primary">ARTE EXCLUSIVO<br /> EXPERIENCIAS INOLVIDABLES</h1>
      <div className="flex justify-between w-full mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col flex-wrap justify-center w-full gap-6 p-5 px-4 md:flex-row md:px-24 sm:items-start md:items-start lg:items-center">
        <div className="relative w-full max-w-md" ref={inputRef}>
        <h2 className="px-4 pt-16 mb-2 text-2xl text-left text-white md:pt-16 sm:pt-8">Busca y alquila tus obras favoritas</h2>
          <input
            type="text"
            placeholder="Encuentra tu obra favorita"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full h-12 py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none"
          />
          {filteredOptions.length > 0 && (
            <ul className="absolute z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg opacity-70 max-h-60">
              {filteredOptions.map((option, index) => (
                <li 
                  key={index} 
                  onMouseDown={() => handleOptionClick(option)} 
                  className="p-2 text-left cursor-pointer hover:bg-gray-200"
                >
                  {option.label} ({option.type.charAt(0).toUpperCase() + option.type.slice(1)})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="px-4 pt-16 mb-2 text-2xl text-left text-white md:pt-16 sm:pt-8">Rango de Fecha</h2>
          <Calendar setDateRange={setDateRange}/>
        </div>
        <div className="flex flex-col justify-self-end">
        <h2 className="pt-16 mb-10 md:pt-16 sm:pt-8"></h2>
          <Button 
          type="button"
          text={<BiSearchAlt /> } 
          bgColor="primary" 
          textColor="black" 
          textSize="2xl" 
          widthSize={window.innerWidth <= 480 ? "full" : "16"} 
          heightSize="12"
          onClick={handleSearch}
          />
        </div>
      </form>
      </div>
      
      {/* Renderizar las obras seleccionadas o mensaje de error solo si se ha buscado */}
      {hasSearched && (
        <div className="mt-8">
          <h2 className="mb-4 text-3xl text-left text-primary">Resultado de búsqueda</h2>
          {error ? (
            <div className="py-12 text-center bg-red-100 rounded-lg">
              <p className="text-xl text-red-600">
                Ha ocurrido un error. Reintente más tarde.
              </p>
            </div>
          ) : selectedArtworks.length > 0 ? (
            <div className="flex grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {selectedArtworks.map((producto) => (
                <Card key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-xl text-secondary">No hay obras disponibles para las fechas seleccionadas.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Buscador;
