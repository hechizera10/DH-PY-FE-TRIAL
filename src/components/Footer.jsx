import Social from "./Social";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="flex bg-black justify-between items-center inline-block bottom-0 w-full h-28 px-12 z-10 border-primary/50">
			<div className="flex flex-col items-center sm:gap-5" >
				<Logo size={16}/>
				<h3 className="tiny-text text-primary pt-2 sm:text-center">
					Todos los derechos reservados | 2024
				</h3>
			</div>
			<Link to="/politicas">
				<p className="text-primary sm:text-center">Políticas de reserva.</p>
			</Link>
			<Social />
		</footer>
	);
};

export default Footer;
