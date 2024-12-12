import { useState } from "react";
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';
import { authService } from "../api/authService.js";
import { emailService } from "../api/emailService.js";
import { AiFillExclamationCircle } from "react-icons/ai";

const Register = () => {
  const { dispatch } = useContextGlobal();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState({
    sent: false,
    error: false,
    message: ''
  });

  const nameRegex = /^[a-zA-Z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) {
          error = "El nombre es requerido";
        } else if (!nameRegex.test(value)) {
          error = "El nombre no es válido";
        }
        break;

      case "lastName":
        if (!value) {
          error = "El apellido es requerido";
        } else if (!nameRegex.test(value)) {
          error = "El apellido no es válido";
        }
        break;

      case "email":
        if (!value) {
          error = "El email es requerido";
        } else if (!emailRegex.test(value)) {
          error = "El email no es válido";
        }
        break;

      case "password":
        if (!value) {
          error = "La contraseña es requerida";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {}
    Object.keys(formData).forEach(field => validateField(field, formData[field]));

    if (Object.keys(validationErrors).length === 0) {
      try {
        const userDataToSend = {
          name: formData.name,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password
        };
        const response = await authService.register(userDataToSend);

        if (response) {
          dispatch({ type: 'ADD_USER', payload: response.user });
          localStorage.setItem('user', JSON.stringify(response.user));

          // Service email
          setEmailStatus({ sent: false, error: false, message: 'Enviando email de confirmación...' })
          const emailResponse = await emailService.register(
            formData.email,
            `${formData.name} ${formData.lastName}`,
            setEmailStatus
          );

          setEmailStatus(emailResponse);  // Actualizamos el estado con la respuesta del servicio
          console.log(emailResponse);
          

          if (emailResponse.success) {
            setErrors({});
            setTimeout(() => {
              navigate('/'); // Redirect to home page
            }, 1000); // Delay for 1 second (or adjust if necessary)
          }
        } else {
          setErrors({ form: response.message || 'Error al registrarse.' });
        }
      } catch (error) {
        setErrors({ form: 'Error del servidor.' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#FDB813] mb-8">
          Registrarse
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E1E1E] rounded-lg p-8 shadow-lg border border-[#FDB813]/20"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.name && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.lastName && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.password && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.confirmPassword && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#FDB813] text-black font-bold rounded-lg hover:bg-[#FDB813]/90 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>
        
        {emailStatus?.message && (
          <div className={`mt-4 p-4 rounded-lg ${
            emailStatus.error 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            <p className="text-center">{emailStatus.message}</p>
            {emailStatus.error && (
              <div className="mt-2 text-center">
                <button
                  onClick={handleResendEmail}
                  className="text-[#FDB813] hover:text-[#FDB813]/80 underline"
                >
                  ¿No has recibido el email? Haz clic aquí para reenviar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;