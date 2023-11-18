import React from "react";
import styles from "@/styles/modules/footer.module.css";
import LogoSvg from "../LogoSvg";
import Link from "next/link";
import { useGlobal } from "@/context/GlobalContext";

const socialMedia = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/franco-espinosa/",
  },
  {
    name: "GitHub",
    url: "https://github.com/GoorezyEST",
  },
];

function Footer() {
  const { langSettings } = useGlobal();

  return (
    <footer className={styles.out_container}>
      <div className={styles.inner_container}>
        <div className={styles.logo}>
          <LogoSvg />
        </div>
        <ul>
          {socialMedia.map((item, index) => {
            return (
              <li key={index}>
                <Link href={item.url} target="_blank">
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <p>
          {langSettings.footer.one}
          <br />
          {langSettings.footer.two}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
