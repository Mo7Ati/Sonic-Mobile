import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { I18nManager } from "react-native";
import { initReactI18next } from "react-i18next";

import enGeneral from "@/locales/en/general.json";
import arGeneral from "@/locales/ar/general.json";
import enHome from "@/locales/en/home.json";
import arHome from "@/locales/ar/home.json";
import enAuth from "@/locales/en/auth.json";
import arAuth from "@/locales/ar/auth.json";
import enOrders from "@/locales/en/orders.json";
import arOrders from "@/locales/ar/orders.json";
import enProfile from "@/locales/en/profile.json";
import arProfile from "@/locales/ar/profile.json";
import enStoreCategory from "@/locales/en/store_category.json";
import arStoreCategory from "@/locales/ar/store_category.json";
import enBranch from "@/locales/en/branch.json";
import arBranch from "@/locales/ar/branch.json";
import enModal from "@/locales/en/modal.json";
import arModal from "@/locales/ar/modal.json";
import enProduct from "@/locales/en/product.json";
import arProduct from "@/locales/ar/product.json";
import enCart from "@/locales/en/cart.json";
import arCart from "@/locales/ar/cart.json";

const resources = {
    en: {
        general: enGeneral,
        home: enHome,
        auth: enAuth,
        orders: enOrders,
        profile: enProfile,
        store_category: enStoreCategory,
        branch: enBranch,
        modal: enModal,
        product: enProduct,
        cart: enCart,
    },
    ar: {
        general: arGeneral,
        home: arHome,
        auth: arAuth,
        orders: arOrders,
        profile: arProfile,
        store_category: arStoreCategory,
        branch: arBranch,
        modal: arModal,
        product: arProduct,
        cart: arCart,
    }
}

i18n.use(initReactI18next).init({
    lng: "en",
    resources: resources,
    fallbackLng: "en",
    defaultNS: "general",
    ns: [
        "general",
        "home",
        "auth",
        "orders",
        "profile",
        "store_category",
        "branch",
        "modal",
        "product",
        "cart",
    ],
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
