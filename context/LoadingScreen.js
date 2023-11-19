"use client";

import { useEffect } from "react";
import { useGlobal } from "./GlobalContext";
import "@/styles/globals.css";
import LogoSvg from "@/components/LogoSvg";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen({ children }) {
  const { isHydrated, langSettings } = useGlobal();

  useEffect(() => {
    if (!isHydrated) {
      document.body.style.height = "100%";
      document.body.style.overflow = "auto";
    }
  }, [isHydrated]);

  return (
    <>
      <AnimatePresence>
        {isHydrated && (
          <motion.section
            className="loading_container"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.2125,
              ease: "circIn",
            }}
          >
            <div className="loading_logo">
              <LogoSvg />
            </div>
            <span>{langSettings.loading.one}</span>
          </motion.section>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
