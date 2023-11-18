"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/modules/fetch-repositories.module.css";
import { useGlobal } from "@/context/GlobalContext";
import Navbar from "@/components/Units/Navbar";
import { useForm } from "react-hook-form";
import SearchIconSvg from "@/components/SearchIconSvg";
import {
  retrieveUserRepositories,
  GitHubRepository,
} from "@/functions/GitHubAPI";
import Link from "next/link";
import { formatDateToCountryFormat } from "@/functions/FormatDate";
import LeftArrowSvg from "@/components/LeftArrowSvg";
import RightArrowSvg from "@/components/RightArrowSvg";
import Footer from "@/components/Units/Footer";

function FetchReposPage() {
  const { setIsHydrated, fetchUser, setFetchUser, langSettings } = useGlobal();

  const {
    register,
    formState: { errors },
    getFieldState,
    handleSubmit,
    reset,
  } = useForm();

  const formRef = useRef(null);

  const formSubmitFunction = (e: any) => {
    setFetchUser(e.username);
  };

  const [data, setData] = useState<GitHubRepository[] | null>(null);
  const [userExist, setUserExist] = useState<boolean>(true);

  useEffect(() => {
    setIsHydrated(false);
    handleData();
  }, []);

  useEffect(() => {
    handleData();
  }, [fetchUser]);

  async function handleData() {
    if (fetchUser !== null) {
      const response = retrieveUserRepositories(fetchUser);
      if ((await response).length > 0) {
        setUserExist(true);
        setImgLoaded(false);
        setData(await response);
      } else {
        setUserExist(false);
        setImgLoaded(false);
        reset();
        setData(null);
      }
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 9;

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = data?.slice(indexOfFirstRepo, indexOfLastRepo);

  const totalPages = Math.ceil((data?.length ?? 0) / reposPerPage);

  const goToPrevPage = () => {
    if (data !== null) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const goToNextPage = () => {
    if (data !== null) {
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(data.length / reposPerPage))
      );
    }
  };

  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImgLoad = () => {
    setImgLoaded(true);
  };

  return (
    <>
      <main className={styles.wrapper}>
        <Navbar />
        <section className={styles.content}>
          <div className={styles.search}>
            <div className={styles.search_main}>
              <h1>
                {langSettings.fetch.one} <span>{langSettings.fetch.two}</span>{" "}
                {langSettings.fetch.three}
              </h1>
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
                        : "var(--accent)",
                  }}
                >
                  {errors.username?.type === "required" &&
                    langSettings.fetch.four}
                  {errors.username?.type === "pattern" &&
                    langSettings.fetch.five}
                  {!errors.username &&
                    getFieldState("username").isDirty &&
                    langSettings.fetch.six}
                  {!errors.username &&
                    !getFieldState("username").isDirty &&
                    langSettings.fetch.six}
                </label>
                <div>
                  <input
                    type="text"
                    id="username"
                    {...register("username", {
                      required: true,
                      pattern: /^[a-zA-Z0-9-]+$/,
                    })}
                    placeholder={langSettings.fetch.seven}
                  />
                  <button type="submit">
                    <div>
                      <SearchIconSvg />
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {data && data.length > 0 && (
              <div className={styles.search_pagination}>
                <button onClick={goToPrevPage} disabled={currentPage === 1}>
                  <LeftArrowSvg />
                </button>
                <span>{currentPage}</span>
                <span>{langSettings.fetch.eight}</span>
                <span>{totalPages}</span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <RightArrowSvg />
                </button>
              </div>
            )}
          </div>
          <div className={styles.results}>
            {data && data?.length > 0 ? (
              <div className={styles.results_fill}>
                <h2>
                  {langSettings.fetch.nine} <span>{data[0].owner.login}</span>
                </h2>
                <div className={styles.results_cards}>
                  {currentRepos &&
                    currentRepos.map((item, index) => {
                      return (
                        <div key={index} className={styles.card}>
                          <div className={styles.card_image}>
                            <div
                              className={styles.card_image_loading}
                              style={{ opacity: imgLoaded ? "0" : "1" }}
                            >
                              <span></span>
                            </div>
                            <img
                              src={item.owner.avatar_url}
                              alt="GitHub user profile image"
                              loading="lazy"
                              onLoad={handleImgLoad}
                            />
                          </div>
                          <div className={styles.card_info}>
                            <span className={styles.card_title}>
                              {item.name}
                            </span>
                            <p className={styles.card_description}>
                              {item.description !== null
                                ? item.description
                                : langSettings.fetch.ten}
                            </p>
                            <p className={styles.card_date}>
                              {formatDateToCountryFormat(
                                item.created_at,
                                langSettings.fetch.lang
                              )}
                            </p>
                            <div className={styles.card_links}>
                              <Link
                                href={item.html_url}
                                target="_blank"
                                className={styles.card_link_repo}
                              >
                                {langSettings.fetch.eleven}
                              </Link>
                              <Link
                                href={item.owner.html_url}
                                target="_blank"
                                className={styles.card_link_profile}
                              >
                                {langSettings.fetch.twelve}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className={styles.results_empty}>
                {!userExist ? (
                  <p style={{ color: "var(--error)" }}>
                    {langSettings.fetch.thirteen}
                  </p>
                ) : (
                  <p style={{ color: "var(--primary)" }}>
                    {langSettings.fetch.fourteen}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default FetchReposPage;
