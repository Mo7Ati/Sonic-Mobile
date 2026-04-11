import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { I18nManager } from "react-native";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
    },
    ar: {
    }
}

i18n.use(initReactI18next).init({
    lng: "en",
    resources: resources,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

/**
 * Reads the user's preferred language from AsyncStorage,
 * falls back to device language, sets i18n + RTL accordingly.
 * Returns true if a reload is needed (RTL state changed).
 */
export async function initLanguage(): Promise<boolean> {
    const stored = await AsyncStorage.getItem("locale");
    const deviceLang = Localization.getLocales()[0]?.languageCode;
    const lang = stored || deviceLang || "en";

    await i18n.changeLanguage(lang);

    const shouldBeRTL = lang === "ar";
    const needsReload = I18nManager.isRTL !== shouldBeRTL;

    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);

    return needsReload;
}

export default i18n;
