import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
	// Cambiar de página
	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const goToPage = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
			<ol className="flex justify-end gap-1 text-xs font-medium">
				<li>
					<button
						onClick={prevPage}
						className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
						disabled={currentPage === 1}
					>
						<GrFormPrevious />
					</button>
				</li>
				{Array.from({ length: totalPages }, (_, i) => (
					<li key={i}>
						<button
							onClick={() => goToPage(i + 1)}
							className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
								currentPage === i + 1
									? "bg-amber-600 text-white"
									: "bg-white text-gray-900"
							}`}
						>
							{i + 1}
						</button>
					</li>
				))}
				<li>
					<button
						onClick={nextPage}
						className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
						disabled={currentPage === totalPages}
					>
						<GrFormNext />
					</button>
				</li>
			</ol>
		</div>
	);
};

export default Pagination;
