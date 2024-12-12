import React, { useState } from 'react';
import '../styles/App.css';

const WhatsAppIcon = () => {
    const [error, setError] = useState('');
    const phoneNumber = "+59898797493"; //Numero del Josh, cambiar.

    const handleClick = () => {
        // Validar el número de teléfono (simple validación)
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Número de WhatsApp no válido.');
            return;
        }
        setError('Se abrirá WhatsApp para enviar tu mensaje.');
        setTimeout(() => {
            window.open(`https://wa.me/${phoneNumber}`, '_blank');
            setError('');
        }, 2000); // Espera 2 segundos antes de abrir WhatsApp
    };

    return (
        <div>
            {error && <div className="whatsapp-message">{error}</div>}
            <a 
                onClick={handleClick} 
                className="whatsapp-icon"
                role="button"
                aria-label="Contactar por WhatsApp"
            >
                <img 
                    src="https://res.cloudinary.com/dr1jbzn9r/image/upload/v1733506708/front/nb6qxyclfurlaw444fq9.png" 
                    alt="WhatsApp" 
                />
            </a>
        </div>
    );
};

export default WhatsAppIcon;
