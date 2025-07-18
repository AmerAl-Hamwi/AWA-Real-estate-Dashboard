import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ar";

interface LangContext {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Context = createContext<LangContext | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <Context.Provider value={{ lang, setLang }}>
      {children}
    </Context.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
};