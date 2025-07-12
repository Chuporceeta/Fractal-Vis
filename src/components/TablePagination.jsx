export default function TablePagination({
    currentPage,
    totalItems,
    itemsPerRow,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 15, 20, 25],
}) {
    const totalRows = Math.ceil(totalItems / itemsPerRow);
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const MAX_VISIBLE = 5;

    const createPageRange = () => {
        const range = [];
        const showLeftDots = currentPage > 3;
        const showRightDots = currentPage < totalPages - 2;

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (!showLeftDots) {
            start = 2;
            end = Math.min(totalPages - 1, MAX_VISIBLE);
        }

        if (!showRightDots) {
            start = Math.max(2, totalPages - MAX_VISIBLE + 2);
            end = totalPages - 1;
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return { range, showLeftDots, showRightDots };
    };

    const { range, showLeftDots, showRightDots } = createPageRange();

    const pageButton = (page) => (
        <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 py-1 border rounded-md text-sm cursor-pointer ${
                page === currentPage
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
            }`}
        >
            {page}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-gray-200 text-sm">
            {/* Rows per page */}
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <span>Rows per page:</span>
                <select
                    className="border rounded px-2 py-1"
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                >
                    {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Page buttons */}
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                    ←
                </button>

                {pageButton(1)}

                {showLeftDots && (
                    <span className="px-2 text-gray-500">…</span>
                )}

                {range.map(pageButton)}

                {showRightDots && (
                    <span className="px-2 text-gray-500">…</span>
                )}

                {totalPages > 1 && pageButton(totalPages)}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                    →
                </button>
            </div>

            {/* Page info */}
            <div className="text-gray-600 mt-2 sm:mt-0">
                Showing {(currentPage-1)*rowsPerPage*itemsPerRow+1}
                –{Math.min(currentPage*rowsPerPage*itemsPerRow, totalItems)} of {totalItems} items
            </div>
        </div>
    );
}
