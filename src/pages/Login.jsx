import { useState, useEffect } from 'react';
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';
import { AiFillExclamationCircle } from "react-icons/ai";
import { authService } from "../api/authService.js";
import { favoritosService } from "../api/favoritosService.js";

const Login = () => {
  const { dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    if (!emailRegex.test(email)) {
      setError("El formato del email no es válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;
  
    try {
      // Usar authService para el login
      const user = await authService.login({ email, password});
      console.log("Usuario logueado:", user);
      dispatch({type: 'LOGIN_USER', payload: user});  // Establecer el usuario en el contexto global
      
      // Obtener y establecer favoritos
      const favoritos = await favoritosService.obtenerFavoritos();
      dispatch({ type: "SET_FAVORITES", payload: favoritos });
      
      setError('');  // Limpiar el error
      navigate('/');  // Redirigir al usuario a la página principal

    } catch (err) {
      setError('Hubo un error en el servidor. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    console.log(storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Dispatch para cargar el usuario desde el localStorage al contexto global
        dispatch({ type: 'LOGIN_USER', payload: userData });
        
        // También cargar los favoritos si hay un usuario
        const loadFavorites = async () => {
          try {
            const favoritos = await favoritosService.obtenerFavoritos();
            dispatch({ type: "SET_FAVORITES", payload: favoritos });
          } catch (error) {
            console.error("Error al cargar favoritos:", error);
          }
        };
        loadFavorites();

        navigate('/');  // Redirigir al usuario a la página principal
      } catch (err) {
        console.error("Error al parsear el usuario desde localStorage:", err);
      }
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col w-full pt-32 min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-center text-white mt-8 mb-8">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto bg-white py-16 p-8 rounded-lg shadow-md">
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Email:</span>
          <input 
            type="email" 
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            onBlur={validateEmail}
            required
          />
        </label>
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Contraseña:</span>
          <input 
            type="password" 
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && (
          <p className="flex items-center text-red-500 font-bold">
            <AiFillExclamationCircle className="mr-2" />{error}
          </p>
        )}
        <button 
          type="submit"
          className="w-full py-2 mt-4 bg-primary text-black font-semibold rounded-lg"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login