// Runs after `vite build`. Copies dist/index.html into a folder for every route so
// deep links like /residency/golden-residency load on any static host without
// server rewrite rules. React Router takes over once the page loads.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const snapshot = JSON.parse(readFileSync(join(root, "src/data/apiSnapshot.json"), "utf8"));

// Mirrors src/router.tsx.
const staticRoutes = [
  "about", "residency", "incorporation", "compliance", "insights", "mohre", "immigration",
  "immigration/regulations", "local-sponsorship", "pricing", "account", "contact", "legal",
  "cookie-policy", "privacy-policy", "website-disclaimer", "partner-with-us", "login", "register",
  "dashboard", "dashboard/profile", "dashboard/notifications", "dashboard/subscription", "dashboard/services",
];

// Mirrors canonicalServicePath() in src/lib/api/services.ts.
const serviceRoutes = snapshot["/api/services/"].map(
  (s) => `${s.pillar === "business-incorporation" ? "incorporation" : "residency"}/${s.slug}`,
);
const dynamicRoutes = [
  ...serviceRoutes,
  ...snapshot["/api/services/"].map((s) => `dashboard/services/${s.slug}`),
  ...snapshot["/api/compliance-areas/"].map((c) => `compliance/${c.slug}`),
  ...snapshot["/api/insights/"].map((a) => `insights/${a.slug}`),
  ...snapshot["/api/team/"].map((t) => `team/${t.slug}`),
];

const index = join(dist, "index.html");
const routes = [...staticRoutes, ...dynamicRoutes];
for (const route of routes) {
  const dir = join(dist, ...route.split("/"));
  mkdirSync(dir, { recursive: true });
  copyFileSync(index, join(dir, "index.html"));
}
copyFileSync(index, join(dist, "404.html")); // unknown URLs still boot the app and show its NotFound page

console.log(`prerender-routes: ${routes.length} route entry points + 404.html`);
