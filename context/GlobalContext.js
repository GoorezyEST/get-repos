import { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/data/Language";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  //Hydration logic to handle loading state
  const [isHydrated, setIsHydrated] = useState(true);
  //Theme logic
  const [theme, setTheme] = useState("light");
  //Store the user searched as a global state
  const [fetchUser, setFetchUser] = useState(null);
  //Languages logic
  const [langSettings, setLangSettings] = useState(Language.es);
  //Visible selector
  const [lang, setLang] = useState(null);

  //Function to swap themes
  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
      document.body.classList.add("dark-theme");
    } else if (theme === "dark") {
      setTheme("light");
      document.body.classList.remove("dark-theme");
    }
  };

  //Function to handle language change
  const swapLanguage = (param) => {
    if (param === "en") {
      setLangSettings(Language.en);
      setLang("en");
      return;
    }
    if (param === "es") {
      setLangSettings(Language.es);
      setLang("es");
      return;
    }
  };

  //Effect to handle language set in first load
  useEffect(() => {
    let userLanguage = navigator.language || navigator.userLanguage;
    if (userLanguage.includes("es")) {
      swapLanguage("es");
    } else {
      swapLanguage("en");
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isHydrated,
        setIsHydrated,
        theme,
        handleThemeChange,
        fetchUser,
        setFetchUser,
        lang,
        langSettings,
        swapLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used with a provider");
  }
  return context;
}
