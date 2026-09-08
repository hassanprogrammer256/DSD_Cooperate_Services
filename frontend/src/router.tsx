import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { AboutPage } from "@/pages/AboutPage";
import { AccountPage } from "@/pages/AccountPage";
import { CompliancePage } from "@/pages/CompliancePage";
import { ComplianceDetailPage } from "@/pages/ComplianceDetailPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { InsightDetailPage } from "@/pages/InsightDetailPage";
import { InsightsPage } from "@/pages/InsightsPage";
import { CookiePolicyPage } from "@/pages/legal/CookiePolicyPage";
import { LegalPage } from "@/pages/legal/LegalPage";
import { PartnerWithUsPage } from "@/pages/legal/PartnerWithUsPage";
import { PrivacyPolicyPage } from "@/pages/legal/PrivacyPolicyPage";
import { WebsiteDisclaimerPage } from "@/pages/legal/WebsiteDisclaimerPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PricingPage } from "@/pages/PricingPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { TeamMemberDetailPage } from "@/pages/TeamMemberDetailPage";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/residency", element: <ServicesPage /> },
      { path: "/residency/:slug", element: <ServiceDetailPage /> },
      { path: "/compliance", element: <CompliancePage /> },
      { path: "/compliance/:slug", element: <ComplianceDetailPage /> },
      { path: "/insights", element: <InsightsPage /> },
      { path: "/insights/:slug", element: <InsightDetailPage /> },
      { path: "/team/:slug", element: <TeamMemberDetailPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      { path: "/contact", element: <ContactPage /> },
      { path: "/legal", element: <LegalPage /> },
      { path: "/cookie-policy", element: <CookiePolicyPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/website-disclaimer", element: <WebsiteDisclaimerPage /> },
      { path: "/partner-with-us", element: <PartnerWithUsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
