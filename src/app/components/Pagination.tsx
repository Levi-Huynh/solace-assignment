import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (direction: "prev" | "next") => void;
};

export function Pagination({ offset, limit, total, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-between mb-7">
      <button className="btn-text" onClick={() => onPageChange("prev")} disabled={offset === 0}>
        <ChevronLeft />
        Previous
      </button>

      <button className="btn-text" onClick={() => onPageChange("next")} disabled={total < limit}>
        Next
        <ChevronRight />
      </button>
    </div>
  );
}
