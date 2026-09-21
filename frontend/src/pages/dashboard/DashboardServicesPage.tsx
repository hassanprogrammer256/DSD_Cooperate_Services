import Chip from "@mui/joy/Chip";
import { Link, useSearchParams } from "react-router-dom";

import { QueryState } from "@/components/common/QueryState";
import { useAuth } from "@/contexts/AuthContext";
import { usePricingTiersQuery } from "@/lib/api/pricing";
import { useServicesQuery } from "@/lib/api/services";
import { useMyServiceRequestsQuery } from "@/lib/api/serviceRequests";
import { useMySubscriptionsQuery } from "@/lib/api/subscriptions";
import type { ServiceRequestStatus } from "@/types";

const STATUS_LABEL: Record<ServiceRequestStatus, string> = {
  new: "New",
  in_review: "In Review",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const STATUS_COLOR: Record<ServiceRequestStatus, "primary" | "warning" | "success" | "danger"> = {
  new: "primary",
  in_review: "warning",
  in_progress: "warning",
  completed: "success",
  rejected: "danger",
};

export function DashboardServicesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedPlanId = searchParams.get("plan");
  const { data: subscriptions, isLoading: loadingSubs } = useMySubscriptionsQuery(!!user);
  const { data: tiers, isLoading: loadingTiers } = usePricingTiersQuery();
  const {
    data: allServices,
    isLoading: loadingServices,
    isError,
    refetch,
  } = useServicesQuery();
  const { data: myRequests } = useMyServiceRequestsQuery(!!user);

  const activeTierId = subscriptions?.find((s) => s.status === "active")?.tierId;
  const activeTier = tiers?.find((t) => t.id === activeTierId);
  const allowedSlugs = new Set(activeTier?.services ?? []);
  const allowedServices = (allServices ?? []).filter((service) => allowedSlugs.has(service.slug));

  // Set when Pricing's Buy Now sent the user here directly (payment isn't configured
  // in this environment yet — see PricingPage.tsx's handleBuyNow) rather than through
  // a completed purchase, so there's no active subscription to show services for.
  const requestedTier = !activeTier ? tiers?.find((t) => t.id === requestedPlanId) : null;

  const isLoading = loadingSubs || loadingTiers || loadingServices;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-display text-lg font-bold capitalize text-accent">Request a Service</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {activeTier
            ? `Services included in your ${activeTier.name} plan.`
            : "You need an active plan to request a service."}
        </p>

        <div className="mt-6">
          <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
            {!activeTier ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/30 bg-surface-secondary p-10 text-center">
                {requestedTier ? (
                  <p className="text-text-secondary">
                    You selected the <span className="font-semibold text-text-primary">{requestedTier.name}</span>{" "}
                    plan, but online payment isn't available in this environment yet. Contact us and we'll activate
                    it for you.
                  </p>
                ) : (
                  <p className="text-text-secondary">You don't have an active plan yet.</p>
                )}
                <Link
                  to={requestedTier ? "/contact" : "/pricing"}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  {requestedTier ? "Contact Us" : "View Pricing"}
                </Link>
              </div>
            ) : allowedServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {allowedServices.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/dashboard/services/${service.slug}`}
                    className="rounded-xl border border-accent/30 bg-surface p-5 transition-colors hover:border-accent"
                  >
                    <h3 className="font-display text-base font-bold capitalize text-accent">{service.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{service.summary}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-accent/30 bg-surface-secondary p-10 text-center text-text-secondary">
                No services are currently included in your plan. Contact us if you think this is a mistake.
              </p>
            )}
          </QueryState>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold capitalize text-accent">My Requests</h2>
        <div className="mt-4">
          {myRequests && myRequests.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-accent/30">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Submitted</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-text-primary">{request.reference}</td>
                      <td className="px-4 py-3 text-text-secondary">{request.serviceTitle}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {new Date(request.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Chip size="sm" color={STATUS_COLOR[request.status]} variant="soft">
                          {STATUS_LABEL[request.status]}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">You haven't submitted any service requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
