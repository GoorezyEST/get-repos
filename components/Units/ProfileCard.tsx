"use client";

import React, { useEffect, useState } from "react";
import { retrieveUserProfile, GitHubProfile } from "@/functions/GitHubAPI";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/GlobalContext";
import {
  extractYearFromDate,
  formatDateToCountryFormat,
} from "@/functions/FormatDate";
import Link from "next/link";
import SingleUserSvg from "@/components/SingleUserSvg";
import MultipleUsersSvg from "@/components/MultipleUsersSvg";
import CalendarSvg from "@/components/CalendarSvg";
import styles from "@/styles/modules/user-profile.module.css";
import GitHubLogoSvg from "../GitHubLogoSvg";
import CloseSvg from "../CloseSvg";

function ProfileCard() {
  const { setIsHydrated, fetchUser, langSettings, setShowProfile } =
    useGlobal();

  const router = useRouter();

  const [data, setData] = useState<GitHubProfile | null>(null);

  const [cardLoading, setCardLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsHydrated(false);
    if (fetchUser === null) {
      router.push("/fetch-repositories");
    } else {
      handleData();
    }
  });

  const handleData = async () => {
    if (fetchUser !== null) {
      const response = await retrieveUserProfile(fetchUser);
      if (response !== null && response?.hasOwnProperty("login")) {
        setData(response);
        setCardLoading(false);
      } else {
        setData(null);
      }
    }
  };

  return (
    <div className={styles.card}>
      {cardLoading && (
        <div className={styles.card_loading}>
          <span></span>
        </div>
      )}
      <div
        className={styles.card_close}
        onClick={() => {
          setShowProfile(false);
        }}
      >
        <CloseSvg />
      </div>
      <div className={styles.card_image}>
        <img src={data?.avatar_url} />
      </div>
      <div className={styles.card_title}>
        <h2>{data?.login}</h2>
        {data?.location !== null && data?.location !== undefined && (
          <span>{data?.location}</span>
        )}
      </div>
      <div className={styles.card_stats}>
        <div className={styles.card_stats_item}>
          <div className={styles.card_stats_item_icon}>
            <SingleUserSvg />
          </div>
          <span>{langSettings.profileCard.one}</span>
          <strong>{data?.followers}</strong>
        </div>

        <div className={styles.card_stats_item}>
          <div className={styles.card_stats_item_icon}>
            <MultipleUsersSvg />
          </div>
          <span>{langSettings.profileCard.two}</span>
          <strong>{data?.following}</strong>
        </div>

        <div className={styles.card_stats_item}>
          <div className={styles.card_stats_item_icon}>
            <CalendarSvg />
          </div>
          <span>{langSettings.profileCard.three}</span>
          <strong>
            {data?.created_at !== undefined
              ? extractYearFromDate(data?.created_at)
              : "Not available"}
          </strong>
        </div>
      </div>
      <Link
        className={styles.card_link}
        href={data?.html_url !== undefined ? data.html_url : "www.github.com"}
        target="_blank"
      >
        {langSettings.profileCard.four} <span>{data?.public_repos}</span>{" "}
        {langSettings.profileCard.five}
      </Link>
    </div>
  );
}

export default ProfileCard;
