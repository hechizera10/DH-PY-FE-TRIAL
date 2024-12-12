import { MdFacebook } from "react-icons/md";
import { PiInstagramLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";


const Social = () => {
	const icons = [
		{ component: MdFacebook, url: "https://facebook.com" },
		{ component: PiInstagramLogoFill, url: "https://instagram.com" },
		{ component: AiFillTikTok, url: "https://tiktok.com" },
		
	];

	return (
		<div className="flex gap-5 items-center">
			{icons.map((icon, index) => {
				const Icon = icon.component;
				// Aplica "text-sm" solo al icono de X que es mas alto que los demas
				
				return (
					<a
						href={icon.url}
						target="_blank"
						rel="noopener noreferrer"
						className={`text-primary text-xl`}
						key={index}
					>
						<Icon />
					</a>
				);
			})}
		</div>
	);
};

export default Social;
