"use client";

import { useGlobal } from "@/context/GlobalContext";
import styles from "@/styles/modules/home.module.css";
import { useEffect, useRef, useState } from "react";
import DecorativeSvg from "@/components/DecorativeSvg";
import Navbar from "@/components/Units/Navbar";
import SearchIconSvg from "@/components/SearchIconSvg";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Footer from "@/components/Units/Footer";

export default function Wrapper() {
  const { setIsHydrated, setFetchUser, langSettings, device } = useGlobal();

  useEffect(() => {
    setIsHydrated(false);
  }, []);

  const {
    register,
    formState: { errors },
    getFieldState,
    handleSubmit,
  } = useForm();

  const formRef = useRef(null);

  const router = useRouter();

  const formSubmitFunction = (e: any) => {
    setFetchUser(e.username);
    router.push("/fetch-repositories");
  };

  return (
    <>
      <main className={styles.wrapper}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.left}>
            <h1>
              {langSettings.home.one} <span>{langSettings.home.two}</span>{" "}
              {langSettings.home.three}
            </h1>
            <p>{langSettings.home.four}</p>
            <form
              autoComplete="off"
              ref={formRef}
              onSubmit={handleSubmit(formSubmitFunction)}
            >
              <label
                htmlFor="username"
                style={{
                  color:
                    errors.username?.type === "required" ||
                    errors.username?.type === "pattern"
                      ? "var(--error)"
                      : "var(--primary)",
                }}
              >
                {errors.username?.type === "required" && langSettings.home.five}
                {errors.username?.type === "pattern" && langSettings.home.six}
                {!errors.username &&
                  getFieldState("username").isDirty &&
                  langSettings.home.seven}
                {!errors.username &&
                  !getFieldState("username").isDirty &&
                  langSettings.home.seven}
              </label>
              <div>
                <input
                  type="text"
                  id="username"
                  {...register("username", {
                    required: true,
                    pattern: /^[a-zA-Z0-9-]+$/,
                  })}
                  placeholder={langSettings.home.eight}
                />
                <button type="submit">
                  <div>
                    <SearchIconSvg />
                  </div>
                </button>
              </div>
            </form>
          </div>
          <div className={styles.right}>
            <div className={styles.right_decoration}>
              <DecorativeSvg />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
