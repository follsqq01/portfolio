'use client';
import { typography } from '../lib/typography';
import {createContext,useContext,useEffect,useState} from 'react';
type Language='ru'|'en';
const LanguageContext=createContext<{lang:Language;setLang:(lang:Language)=>void}>({lang:'en',setLang:()=>{}});
export function LanguageProvider({children}:{children:React.ReactNode}){
  const [lang, updateLang] = useState<Language>('en');
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('portfolio-language');
      if (saved === 'ru' || saved === 'en') updateLang(saved);
    } catch { /* Language selection still works when storage is unavailable. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (language: Language) => {
    updateLang(language);
    try { sessionStorage.setItem('portfolio-language', language); } catch {}
  };
  return <LanguageContext.Provider value={{lang,setLang}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const {lang,setLang}=useContext(LanguageContext);return {lang,setLang,t:(ru:string,en:string)=>typography(lang==='ru'?ru:en)};}
