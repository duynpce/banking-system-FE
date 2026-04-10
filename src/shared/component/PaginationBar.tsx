import { useMemo, useState } from "react";

type PaginationBarProps = {
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  currentPageData?: number;
};

const PaginationBar = ({ totalPage, setPage, currentPageData }: PaginationBarProps) => {
  const safeTotalPage = useMemo(() => Math.max(1, totalPage), [totalPage]);
  const [currentPage, setCurrentPage] = useState(currentPageData || 1);

  const handleChangePage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), safeTotalPage);
    setCurrentPage(nextPage);
    setPage(nextPage);
  };

  return (
    <nav className="flex justify-end items-center gap-2 mt-6">
      <button
        onClick={() => handleChangePage(currentPage - 1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
      >
        &lt; Previous
      </button>
      {Array.from({ length: safeTotalPage }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handleChangePage(page)}
          className={`w-8 h-8 rounded-full text-sm font-medium ${
            currentPage === page ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handleChangePage(currentPage + 1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
      >
        Next &gt;
      </button>
    </nav>
  );
};

export default PaginationBar;
