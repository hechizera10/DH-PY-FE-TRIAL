import { Link } from "react-router-dom";

const Logo = ({ size }) => {
	return (
		<Link to="/">
			<div className="flex justify-between items-center gap-2">
				<img src="/images/logo.png" className={`w-full h-${size}`} alt="Logo" />
			</div>
		</Link>
	);
};

export default Logo;


