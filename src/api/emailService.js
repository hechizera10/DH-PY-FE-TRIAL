import emailjs from '@emailjs/browser';
import axiosConfig from "./axiosConfig";

export const emailService = {
  // Función para enviar el correo de confirmación de registro
  register: async (userEmail, userName, setEmailStatus) => {
    try {
      const baseUrl = axiosConfig.defaults.baseURL;
      const loginUrl = `${baseUrl}/api/auth/login`;

      await emailjs.send(
        'service_g4ywxm6',  // Service ID de EmailJS
        'template_qq0x3dc', // Template ID para registro
        {
          user_email: userEmail,
          user_name: userName,
          login_url: loginUrl,
          to_email: userEmail,
        },
        '2Pgg6a24lfS4J2fVD'   // Public Key de EmailJS
      );

      setEmailStatus({
        sent: true,
        error: false,
        message: '¡Email de confirmación de registro enviado exitosamente!'
      });
      return { success: true }; // Explicitly returning success

    } catch (error) {
      console.error('Error al enviar email de registro:', error);
      setEmailStatus({
        sent: false,
        error: true,
        message: 'Error al enviar el email de confirmación de registro'
      });
      return { success: false }; // Return failure explicitly
    }
  },

  // Función para enviar el correo de confirmación de reserva
  registerConfirmation: async (userEmail, userName, selectedDates, producto, setEmailStatus) => {
    try {
      const baseUrl = import.meta.env.PROD
        ? axiosConfig.defaults.baseURL
        : 'http://localhost:8080';

      await emailjs.send(
        'service_g4ywxm6',  // Service ID de EmailJS
        'template_zwzuw0m', // Template ID para confirmación de reserva
        {
          user_email: userEmail,
          user_name: userName,
          start_date: selectedDates.startDate.toLocaleDateString(),
          end_date: selectedDates.endDate.toLocaleDateString(),
          duration: Math.ceil((selectedDates.endDate - selectedDates.startDate) / (1000 * 60 * 60 * 24)),
          product_name: producto.nombre,
          artist_name: producto.artista?.nombre,
          total_price: (producto.precioRenta * Math.ceil((selectedDates.endDate - selectedDates.startDate) / (1000 * 60 * 60 * 24))).toLocaleString(),
          to_email: userEmail,
        },
        '2Pgg6a24lfS4J2fVD'   // Public Key de EmailJS
      );

      setEmailStatus({
        sent: true,
        error: false,
        message: '¡Email de confirmación de reserva enviado exitosamente!'
      });
      return { success: true }; // Explicitly returning success

    } catch (error) {
      console.error('Error al enviar email de confirmación de reserva:', error);
      setEmailStatus({
        sent: false,
        error: true,
        message: 'Error al enviar el email de confirmación de reserva'
      });
      return { success: false }; // Return failure explicitly
    }
  }
};