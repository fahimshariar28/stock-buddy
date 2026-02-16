import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
};

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: TPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold ${currentPage <= 1 ? "text-gray-400 cursor-not-allowed bg-gray-100" : " text-gray-700 bg-white hover:bg-gray-100 border border-gray-300"}`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft /> Previous
      </Link>
      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={index} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isCurrent = pageNumber === currentPage;

        return (
          <Link
            key={index}
            href={getPageUrl(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${isCurrent ? "bg-purple-600 text-white" : "text-gray-700 bg-white hover:bg-gray-100 border border-gray-300"}`}
          >
            {pageNumber}
          </Link>
        );
      })}
      <Link
        href={getPageUrl(currentPage + 1)}
        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold ${currentPage >= totalPages ? "text-gray-400 cursor-not-allowed bg-gray-100" : " text-gray-700 bg-white hover:bg-gray-100 border border-gray-300"}`}
        aria-disabled={currentPage >= totalPages}
      >
        Next <ChevronRight />
      </Link>
    </nav>
  );
}
