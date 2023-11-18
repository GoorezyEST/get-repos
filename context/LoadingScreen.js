"use client";

import { useEffect } from "react";
import { useGlobal } from "./GlobalContext";
import "@/styles/globals.css";
import LogoSvg from "@/components/LogoSvg";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen({ children }) {
  const { isHydrated } = useGlobal();

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
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.225,
              ease: "circIn",
            }}
          >
            <div className="loading_logo">
              <LogoSvg />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
