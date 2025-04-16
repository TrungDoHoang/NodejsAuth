import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      // Order of detection methods
      order: ["header", "querystring", "cookie"],
      // Look for the language in the 'Accept-Language' header
      lookupHeader: "accept-language",
      // Look for the language in the 'lang' query parameter
      lookupQuerystring: "lang",
      // Look for the language in the 'i18next' cookie
      lookupCookie: "i18next",
      // Cache the language in cookies
      caches: ["cookie"],
    },
    ns: ["translation"],
    defaultNS: "translation",
  });

export default i18next;
