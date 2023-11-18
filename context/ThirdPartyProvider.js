"use client";

import { GlobalProvider } from "./GlobalContext";
import { LoadingScreen } from "./LoadingScreen";

export default function ThirdPartyProvider({ children }) {
  return (
    <GlobalProvider>
      <LoadingScreen>{children}</LoadingScreen>
    </GlobalProvider>
  );
}
