"use client";

import useSWR from "swr";
import { Locale, DEFAULT_LOCALE, translations } from "@/lib/i18n";

// Helper để kiểm tra giá trị có hợp lệ với enum Locale không
const isValidLocale = (value: any): value is Locale => {
  return Object.values(Locale).includes(value);
};

// Hàm lấy từ browser nếu cần
const detectLocaleFromBrowser = (): Locale => {
  const browserLang = navigator.language.split("-")[0];
  return browserLang === "vi" ? Locale.vi : DEFAULT_LOCALE;
};

// Fetcher function to retrieve locale
const fetcher = () => {
  if (typeof window !== "undefined") {
    const storedLocale = localStorage.getItem("locale");

    if (storedLocale) {
      // Nếu là "auto" thì lấy theo trình duyệt
      if (storedLocale === "auto") {
        return detectLocaleFromBrowser();
      }

      // Nếu là Locale hợp lệ thì return
      if (isValidLocale(storedLocale)) {
        return storedLocale;
      }
    } else {
      // Nếu chưa có gì → lưu "auto" & detect
      localStorage.setItem("locale", "auto");
      return detectLocaleFromBrowser();
    }
  }

  // Trường hợp SSR hoặc fallback
  return DEFAULT_LOCALE;
};

export const useLocale = () => {
  const { data: locale, mutate } = useSWR("locale", fetcher);
  const currentLocale = (locale || DEFAULT_LOCALE) as Locale;
  const changeLocale = (newLocale: Locale | "auto") => {
    localStorage.setItem("locale", newLocale);
    mutate();
  };

  return {
    locale: locale || DEFAULT_LOCALE,
    translations: translations[currentLocale],
    changeLocale,
  };
};
