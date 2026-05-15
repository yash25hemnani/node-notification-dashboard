import { useCallback, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UsePaginatedTableOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface PaginatedTableState {
  page: number;
  limit: number;
}

export interface UsePaginatedTableReturn {
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  // Helper: build query params to append to your API call
  queryParams: Record<string, string>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages pagination state (page + limit).
 * Pass `onPageChange` and `onLimitChange` directly to <DataTable />.
 * Use `queryParams` to append to your API fetch call.
 *
 * @example
 * const { page, limit, onPageChange, onLimitChange, queryParams } = usePaginatedTable();
 *
 * const { data } = useQuery({
 *   queryKey: ["users", queryParams],
 *   queryFn: () => fetchUsers(queryParams),
 * });
 */
export function usePaginatedTable({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginatedTableOptions = {}): UsePaginatedTableReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // reset to page 1 when limit changes
  }, []);

  return {
    page,
    limit,
    onPageChange,
    onLimitChange,
    queryParams: {
      page: String(page),
      limit: String(limit),
    },
  };
}