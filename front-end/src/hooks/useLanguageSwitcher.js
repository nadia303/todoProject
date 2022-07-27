import React, { createContext, useState, useContext, useEffect } from "react";
import { LANGUAGES } from "../utils/languages";
import { getItem, setItem } from "../utils/localStorage";

const languageContext = createContext({});

const useProvideLanguage = () => {
  const [language, setLanguage] = useState(LANGUAGES.EN);

  useEffect(() => {
    let value = getItem("language");
    if (value) {
      setLanguage(value);
    }
  }, [language]);

  const changeLanguage = (lang) => {
    setItem("language", lang);
    setLanguage(lang);
  };

  return {
    activeLanguage: language,
    languages: LANGUAGES,
    changeLanguage,
  };
};

export const LanguageSwitcherProvider = ({ children }) => {
  const lang = useProvideLanguage();

  return (
    <languageContext.Provider value={lang}>{children}</languageContext.Provider>
  );
};

export default function useLanguageSwitcher() {
  return useContext(languageContext);
}
