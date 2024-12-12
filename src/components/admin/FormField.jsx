import { formatLabel } from "../../utils/formatFunctions";

const FormField = ({
	element = "input",
	name,
	label,
	value,
	onChange,
	children,
}) => {
	return (
		<label className="font-bold">
			{/*console.log(JSON.stringify(value), element)*/}
			{formatLabel(label)}:
			{element === "select" ? (
				<select
					name={name}
					value={value}
					onChange={onChange}
					className="block w-full mt-1 mb-2 p-2 font-normal border border-gray-300 rounded"
				>
					{children}
				</select>
			) : element === "textarea" ? (
				<textarea
					name={name}
					value={value}
					onChange={onChange}
					className="block w-full font-normal mt-1 mb-4 p-2 border border-gray-300 rounded"
				/>
			) : element === "imagen" ? (
				<div className="row flex flex-wrap gap-2">
					{...value.map(element => 
						 <img
							src={element.url}
							alt={element.nombre || "Imagen"}
							className="w-16 h-16 object-cover"
						/>
					)}
				</div>
			) : element === "date" ? (
				<input
					type="date"
					name={name}
					value={value}
					onChange={onChange}
					className="block w-full font-normal mt-1 mb-4 p-2 border border-gray-300 rounded"
				/>
			) : (
				<input
					type="text"
					name={name}
					value={value}
					onChange={onChange}
					className="block w-full font-normal mt-1 mb-4 p-2 border border-gray-300 rounded"
				/>
			)}
		</label>
	);
};

export default FormField;
