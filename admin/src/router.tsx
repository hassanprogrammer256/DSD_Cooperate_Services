import { Navigate, createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServicesListPage } from "@/pages/services/ServicesListPage";
import { ServiceFormPage } from "@/pages/services/ServiceFormPage";
import { ComplianceListPage } from "@/pages/compliance/ComplianceListPage";
import { ComplianceFormPage } from "@/pages/compliance/ComplianceFormPage";
import { InsightsListPage } from "@/pages/insights/InsightsListPage";
import { InsightFormPage } from "@/pages/insights/InsightFormPage";
import { TeamListPage } from "@/pages/team/TeamListPage";
import { TeamFormPage } from "@/pages/team/TeamFormPage";
import { FounderFormPage } from "@/pages/founder/FounderFormPage";
import { TestimonialsListPage } from "@/pages/testimonials/TestimonialsListPage";
import { TestimonialFormPage } from "@/pages/testimonials/TestimonialFormPage";
import { StatsListPage } from "@/pages/stats/StatsListPage";
import { StatFormPage } from "@/pages/stats/StatFormPage";
import { PricingListPage } from "@/pages/pricing/PricingListPage";
import { PricingFormPage } from "@/pages/pricing/PricingFormPage";
import { OrdersListPage } from "@/pages/orders/OrdersListPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "/", element: <Navigate to="/services" replace /> },
          { path: "/services", element: <ServicesListPage /> },
          { path: "/services/:slug", element: <ServiceFormPage /> },
          { path: "/compliance", element: <ComplianceListPage /> },
          { path: "/compliance/:slug", element: <ComplianceFormPage /> },
          { path: "/insights", element: <InsightsListPage /> },
          { path: "/insights/:slug", element: <InsightFormPage /> },
          { path: "/team", element: <TeamListPage /> },
          { path: "/team/:slug", element: <TeamFormPage /> },
          { path: "/founder", element: <FounderFormPage /> },
          { path: "/testimonials", element: <TestimonialsListPage /> },
          { path: "/testimonials/:id", element: <TestimonialFormPage /> },
          { path: "/stats", element: <StatsListPage /> },
          { path: "/stats/:id", element: <StatFormPage /> },
          { path: "/pricing", element: <PricingListPage /> },
          { path: "/pricing/:id", element: <PricingFormPage /> },
          { path: "/orders", element: <OrdersListPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
