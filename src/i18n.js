import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./components/json/ar.json";
import de from "./components/json/de.json";
import en from "./components/json/en.json";
import es from "./components/json/es.json";
import fr from "./components/json/fr.json";
import it from "./components/json/it.json";
import ka from "./components/json/ka.json";
import pt from "./components/json/pt.json";
import ru from "./components/json/ru.json";
import th from "./components/json/th.json";
import tr from "./components/json/tr.json";
import uk from "./components/json/uk.json";
import zh from "./components/json/zh.json";

const resources = {
    ar: { translation: ar || {} },
    de: { translation: de || {} },
    en: { translation: en || {} },
    es: { translation: es || {} },
    fr: { translation: fr || {} },
    it: { translation: it || {} },
    ka: { translation: ka || {} },
    pt: { translation: pt || {} },
    ru: { translation: ru || {} },
    th: { translation: th || {} },
    tr: { translation: tr || {} },
    uk: { translation: uk || {} },
    zh: { translation: zh || {} },
};

i18n
    .use(initReactI18next)
    .init({
        debug: false,
        resources,
        fallbackLng: "en",
        supportedLngs: Object.keys(resources),
        nonExplicitSupportedLngs: true,
        cleanCode: true,
        load: "languageOnly",
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });

export default i18n;
