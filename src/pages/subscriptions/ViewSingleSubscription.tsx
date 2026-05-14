import apiClient from "@/api/apiClient";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import PageContainer from "@/components/ui/page-container";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SideRow } from "@/pages/notifications/components/SideRow";
import type { Subscription } from "./types/subscription.types";

const ViewSingleSubscription = () => {
  const { customerEmail } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscription = async () => {
    if (!customerEmail) return;

    setIsLoading(true);

    try {
      const response = await apiClient.get("/admin/subscriptions", {
        params: { customerEmail },
      });

      if (response.status === 200) {
        setSubscriptions(response.data.data.subscriptions ?? []);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [customerEmail]);

  if (!customerEmail) return null;

  return (
    <PageContainer
      heading={
        <Box className="flex flex-col gap-2">
          <span>Subscription details</span>
          <span className="text-xs text-muted-foreground">{customerEmail}</span>
        </Box>
      }
    >
      <Box className="space-y-4">
        {isLoading ? (
          <Box className="rounded-xl border border-dashed border-muted/40 bg-card p-6 text-sm text-muted-foreground">
            Loading subscription details...
          </Box>
        ) : subscriptions.length === 0 ? (
          <Box className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            No subscriptions were found for this customer.
          </Box>
        ) : (
          subscriptions.map((subscription, index) => (
            <Box
              key={subscription.id ?? subscription.endpoint ?? index}
              className="rounded-xl border bg-card"
            >
              <Box className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <Box>
                  <p className="text-sm font-semibold text-foreground">
                    Subscription {subscription.id ?? index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Customer ID: {subscription.customerId ?? "—"}
                  </p>
                </Box>
                {subscription.endpoint ? (
                  <Badge variant="outline" className="text-xs uppercase">
                    Push endpoint
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs uppercase">
                    Missing endpoint
                  </Badge>
                )}
              </Box>

              <Box className="p-4 space-y-3">
                <SideRow
                  label="Customer email"
                  value={subscription.customerEmail ?? "—"}
                />
                <SideRow
                  label="Customer ID"
                  value={subscription.customerId ?? "—"}
                />
                <SideRow
                  label="Subscription ID"
                  value={subscription.id ?? "N/A"}
                />
                <SideRow
                  label="Endpoint"
                  value={subscription.endpoint ?? "—"}
                />
                {subscription.keys?.p256dh && (
                  <SideRow
                    label="P256dh"
                    value={subscription.keys.p256dh}
                  />
                )}
                {subscription.keys?.auth && (
                  <SideRow label="Auth" value={subscription.keys.auth} />
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </PageContainer>
  );
};

export default ViewSingleSubscription;
