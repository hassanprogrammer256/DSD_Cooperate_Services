import { useLayoutEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { MobileBottomTabBar } from "@/components/layout/MobileBottomTabBar";
import { MobileFloatingActions } from "@/components/layout/MobileFloatingActions";
import { Navbar } from "@/components/layout/Navbar";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useLayoutEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useLayoutEffect(() => {
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.href = canonicalUrl;
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className={isHome ? "" : "pt-16 md:pt-18"}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
      <MobileFloatingActions />
      <MobileBottomTabBar />
    </>
  );
}
