const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['hu', 'en'];
const TRANSLATIONS = {
  hu: {
    first_round: "Első szint",
    second_round: "Második szint",
    last_round: "Utolsó szint"
  },
  en: {
    first_round: "First round",
    second_round: "Second round",
    last_round: "Third round"
  }
};
export const translate = (key, customLang) => {
  const lang = customLang || DEFAULT_LANGUAGE;
  return TRANSLATIONS[lang !== undefined
    && SUPPORTED_LANGUAGES.includes(lang) ?
    lang : DEFAULT_LANGUAGE][key];
};
//# sourceMappingURL=translations.util.js.map
