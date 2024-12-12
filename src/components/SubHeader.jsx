import ButtonSet from "./ButtonSet";

const SubHeader = ({ title, buttons }) => {
	

	return (
		<div className="fixed flex w-screen h-12 text-sm bg-white/50 top-24 subheader">
			<div className="fixed flex items-center justify-between w-screen h-12 px-20 text-sm bg-black/75 top-24">
				<h2 className="px-2 text-white">{title}</h2>
				<ButtonSet buttons={buttons} />
			</div>
		</div>
	);
};

export default SubHeader;

