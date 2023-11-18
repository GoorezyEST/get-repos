import React from "react";
import LogoSvg from "@/components/LogoSvg";
import MoonIconSvg from "@/components/MoonIconSvg";
import SunIconSvg from "@/components/SunIconSvg";
import Link from "next/link";
import { useGlobal } from "@/context/GlobalContext";
import styles from "@/styles/modules/navbar.module.css";
import { usePathname } from "next/navigation";
import EnglishFlagSvg from "../EnglishFlagSvg";
import SpanishFlagSvg from "../SpanishFlagSvg";

function Navbar() {
  const { theme, handleThemeChange, lang, langSettings, swapLanguage } =
    useGlobal();

  const route = usePathname();

  const changeLang = () => {
    if (lang === "es") {
      swapLanguage("en");
    } else {
      swapLanguage("es");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <LogoSvg />
      </div>
      <ul className={styles.navbar_links}>
        <li>
          <Link
            href="/"
            style={{
              color: route === "/" ? "var(--accent)" : "var(--primary)",
            }}
          >
            {langSettings.navbar.one}
          </Link>
        </li>
        <li>
          <Link
            href="/fetch-repositories"
            style={{
              color:
                route === "/fetch-repositories"
                  ? "var(--accent)"
                  : "var(--primary)",
            }}
          >
            {langSettings.navbar.two}
          </Link>
        </li>
        <li>
          <div className={styles.flag} onClick={changeLang}>
            {lang === "es" ? <EnglishFlagSvg /> : <SpanishFlagSvg />}
          </div>
        </li>
        <li>
          <button onClick={handleThemeChange}>
            {theme && theme === "light" ? <MoonIconSvg /> : <SunIconSvg />}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
