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
import StarSvg from "@/components/StarSvg";
import ErrorSvg from "@/components/ErrorSvg";
import MessageSvg from "@/components/MessageSvg";
import UpAndDownArrowSvg from "@/components/UpAndDownArrowSvg";
import ProfileCard from "@/components/Units/ProfileCard";
import { AnimatePresence, motion } from "framer-motion";

function FetchReposPage() {
  const {
    setIsHydrated,
    fetchUser,
    setFetchUser,
    langSettings,
    showProfile,
    setShowProfile,
  } = useGlobal();

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
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(false);
    handleData();

    return () => {
      setFetchUser(null);
    };
  }, []);

  useEffect(() => {
    handleData();
  }, [fetchUser]);

  async function handleData() {
    if (fetchUser !== null) {
      try {
        const response = await retrieveUserRepositories(fetchUser);

        if (typeof response !== "number") {
          setUserExist(true);
          setImgLoaded(false);
          setData(response);
        } else {
          setStatus(response);
          setUserExist(false);
          setImgLoaded(false);
          reset();
          setData(null);
        }
      } catch (error) {
        // Handle other errors if needed
        console.error("Error handling data:", error);
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
      scrollTop();
    }
  };

  const goToNextPage = () => {
    if (data !== null) {
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(data.length / reposPerPage))
      );
      scrollTop();
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0 });
  };

  const [imgLoaded, setImgLoaded] = useState(true);

  const handleImgLoad = () => {
    setImgLoaded(true);
  };

  const [dropdownState, setDropdownState] = useState<boolean>(false);

  const [currentSort, setCurrentSort] = useState<string>("newest");

  const handleSort = (param: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (currentSort !== param) {
      setCurrentSort(param);

      switch (param) {
        case "newest":
          setData((prev) => {
            if (prev) {
              const sortedPrev = prev.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA;
              });

              return sortedPrev;
            } else {
              return prev;
            }
          });
          setCurrentPage(1);
          break;
        case "oldest":
          setData((prev) => {
            if (prev) {
              const sortedPrev = prev.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateA - dateB;
              });

              return sortedPrev;
            } else {
              return prev;
            }
          });
          setCurrentPage(1);
          break;
        case "more-stars":
          setData((prev) => {
            if (prev) {
              const sortedPrev = prev.sort((a, b) => {
                const starsA = a.stargazers_count;
                const starsB = b.stargazers_count;
                return starsB - starsA;
              });

              return sortedPrev;
            } else {
              return prev;
            }
          });
          setCurrentPage(1);
          break;
        case "less-stars":
          setData((prev) => {
            if (prev) {
              const sortedPrev = prev.sort((a, b) => {
                const starsA = a.stargazers_count;
                const starsB = b.stargazers_count;
                return starsA - starsB;
              });

              return sortedPrev;
            } else {
              return prev;
            }
          });
          setCurrentPage(1);
          break;
      }
    } else {
      return;
    }
  };

  const profileCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileCardRef]);

  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const subDropdownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownState(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showProfile && (
          <motion.section
            className={styles.card_container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.25,
            }}
          >
            <div ref={profileCardRef}>
              <ProfileCard />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
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
              <ul className={styles.search_sort}>
                <li
                  onClick={() => {
                    setDropdownState((prev) => !prev);
                  }}
                  ref={dropdownRef}
                >
                  {langSettings.dropdown.one}
                  <div
                    style={{
                      transform: dropdownState
                        ? "rotate(-180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <UpAndDownArrowSvg />
                  </div>
                </li>
                <ul
                  className={styles.search_sort_dropdown}
                  style={{ transform: dropdownState ? "scale(1)" : "scale(0)" }}
                  ref={subDropdownRef}
                >
                  <li
                    style={{
                      backgroundColor:
                        currentSort === "newest"
                          ? "var(--dropdown-item-hover)"
                          : "",
                    }}
                    onClick={(event) => handleSort("newest", event)}
                  >
                    {langSettings.dropdown.two}
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        currentSort === "oldest"
                          ? "var(--dropdown-item-hover)"
                          : "",
                    }}
                    onClick={(event) => handleSort("oldest", event)}
                  >
                    {langSettings.dropdown.three}
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        currentSort === "more-stars"
                          ? "var(--dropdown-item-hover)"
                          : "",
                    }}
                    onClick={(event) => handleSort("more-stars", event)}
                  >
                    {langSettings.dropdown.four}
                  </li>
                  <li
                    style={{
                      backgroundColor:
                        currentSort === "less-stars"
                          ? "var(--dropdown-item-hover)"
                          : "",
                    }}
                    onClick={(event) => handleSort("less-stars", event)}
                  >
                    {langSettings.dropdown.five}
                  </li>
                </ul>
              </ul>
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
                              onError={handleImgLoad}
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
                            <div className={styles.card_stars}>
                              <StarSvg />
                              <span>{item.stargazers_count}</span>
                            </div>
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
                              <span
                                onClick={() => {
                                  setShowProfile(true);
                                }}
                                className={styles.card_link_profile}
                              >
                                {langSettings.fetch.twelve}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className={styles.bottom_pagination}>
                  <div className={styles.bottom_pagination_content}>
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
                </div>
              </div>
            ) : (
              <div className={styles.results_empty}>
                {userExist && (
                  <div className={styles.welcome_text}>
                    <MessageSvg />
                    <p style={{ color: "var(--primary)" }}>
                      {langSettings.fetch.fourteen}
                    </p>
                  </div>
                )}
                {!userExist && status === null && (
                  <div className={styles.not_found}>
                    <ErrorSvg />
                    <p style={{ color: "var(--error)" }}>
                      {langSettings.fetch.thirteen}
                    </p>
                  </div>
                )}
                {status === 403 ||
                  (status === 500 && (
                    <div className={styles.not_found}>
                      <ErrorSvg />
                      <p style={{ color: "var(--error)" }}>
                        {langSettings.fetch.fifteen}
                      </p>
                    </div>
                  ))}
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
