import apiClient from "@/api/apiClient";
import { AppTable } from "@/components/ui/app-table";
import PageContainer from "@/components/ui/page-container";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSubscriptionColumns } from "./columns/getSubscriptionColumns";
import type { Subscription } from "./types/subscription.types";

interface Payload extends Subscription {
  count: number;
}

const AllSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Payload[]>([]);
  const showAlert = useAlertStore((s) => s.showAlert);

  const [searchParams] = useSearchParams();
  const customerEmail = searchParams.get("customerEmail");

  const fetchAllSubscriptions = async () => {
    try {
      const response = await apiClient.get("/admin/subscriptions", {
        params: { customerEmail: customerEmail || undefined },
      });

      if (response.status === 200) {
        setSubscriptions(response.data.data.subscriptions);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };
  
  useEffect(() => {
    fetchAllSubscriptions();
  }, []);

  const columns = getSubscriptionColumns();

  return (
    <PageContainer heading="Subscriptions">
      <AppTable
        rows={subscriptions}
        columns={columns}
        emptyMessage="No Subscriptions Yet"
      />
    </PageContainer>
  );
};

export default AllSubscriptions;
