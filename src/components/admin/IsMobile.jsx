import { PiMaskSad } from "react-icons/pi";

const IsMobile = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center w-full px-8">
			<PiMaskSad className="text-8xl text-gray-500 mb-4" />
			<h1 className="text-2xl font-bold text-center">
				Esta página no está disponible en tablets y celulares.
			</h1>
			<p className="pt-12 text-center">
				Ingresa desde un dispositivo de Escritorio para poder utilizar
				estas funciones.
			</p>
		</div>
	);
};

export default IsMobile;
