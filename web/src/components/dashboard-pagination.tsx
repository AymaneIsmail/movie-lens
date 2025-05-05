import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DashboardPaginationProps {
  pageStackLength: number;
  goNext: () => void;
  goPrev: () => void;
}

export function DashboardPagination({
  pageStackLength,
  goNext,
  goPrev,
}: DashboardPaginationProps) {
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={goPrev} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive>{pageStackLength}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={goNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
