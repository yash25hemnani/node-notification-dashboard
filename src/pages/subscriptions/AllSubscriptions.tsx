import apiClient from "@/api/apiClient";
import { DataTable, type PaginationMeta } from "@/components/ui/data-table";
import PageContainer from "@/components/ui/page-container";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getSubscriptionColumns } from "./columns/getSubscriptionColumns";
import type { Subscription } from "./types/subscription.types";
import SearchBar from "@/components/ui/search-bar";
import { Box } from "@/components/ui/box";
import { useState } from "react";

interface Payload extends Subscription {
  count: number;
}

interface SubscriptionsResponse {
  data: Payload[];
  pagination: PaginationMeta;
}

const EMPTY_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const fetchSubscriptions = async (
  queryParams: Record<string, string>,
  customerEmail: string | null,
  search: string,
): Promise<SubscriptionsResponse> => {
  const response = await apiClient.get("/admin/subscriptions", {
    params: {
      customerEmail: customerEmail || undefined,
      ...queryParams,
      search,
    },
  });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

const AllSubscriptions = () => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const [searchParams] = useSearchParams();
  const customerEmail = searchParams.get("customerEmail");
  const [search, setSearch] = useState("");

  const { onPageChange, onLimitChange, queryParams } = usePaginatedTable({
    initialLimit: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions", customerEmail, queryParams, search],
    queryFn: () => fetchSubscriptions(queryParams, customerEmail, search),
    placeholderData: (prev) => prev,
    throwOnError: (error) => {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
      return false;
    },
  });

  const columns = getSubscriptionColumns();

  return (
    <PageContainer heading="Subscriptions">
      <Box className="flex flex-col gap-4">
        <SearchBar
          placeholder="Search Subscriptions..."
          onChange={(val) => {
            setSearch(val);
            onPageChange(1);
          }}
        />
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pagination={data?.pagination ?? EMPTY_PAGINATION}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </Box>
    </PageContainer>
  );
};

export default AllSubscriptions;
