import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enGeneral from "@/locales/en/general.json";
import arGeneral from "@/locales/ar/general.json";
import enHome from "@/locales/en/home.json";
import arHome from "@/locales/ar/home.json";
import enAuth from "@/locales/en/auth.json";
import arAuth from "@/locales/ar/auth.json";
import enOrders from "@/locales/en/orders.json";
import arOrders from "@/locales/ar/orders.json";
import enSettings from "@/locales/en/settings.json";
import arSettings from "@/locales/ar/settings.json";
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
import enAddresses from "@/locales/en/addresses.json";
import arAddresses from "@/locales/ar/addresses.json";
import enOnboarding from "@/locales/en/onboarding.json";
import arOnboarding from "@/locales/ar/onboarding.json";
import { I18nManager } from "react-native";


export type AppLanguage = "ar" | "en";

export const LANGUAGE_STORAGE_KEY = "sonic_language";
export const DEFAULT_LANGUAGE: AppLanguage = "ar";

const resources = {
    en: {
        general: enGeneral,
        home: enHome,
        auth: enAuth,
        orders: enOrders,
        settings: enSettings,
        store_category: enStoreCategory,
        branch: enBranch,
        modal: enModal,
        product: enProduct,
        cart: enCart,
        addresses: enAddresses,
        onboarding: enOnboarding,
    },
    ar: {
        general: arGeneral,
        home: arHome,
        auth: arAuth,
        orders: arOrders,
        settings: arSettings,
        store_category: arStoreCategory,
        branch: arBranch,
        modal: arModal,
        product: arProduct,
        cart: arCart,
        addresses: arAddresses,
        onboarding: arOnboarding,
    },
};

const getStoredLanguage = async () => {
    const stored = await AsyncStorage.getItem('appLanguage');
    if (stored) return stored;
    return I18nManager.isRTL ? 'ar' : 'en';
};


const initI18n = async () => {
    const storedLanguage = await getStoredLanguage();

    await i18n.use(initReactI18next).init({
        lng: storedLanguage,
        resources,
        fallbackLng: DEFAULT_LANGUAGE,
        defaultNS: "general",
        ns: [
            "general",
            "home",
            "auth",
            "orders",
            "settings",
            "store_category",
            "branch",
            "modal",
            "product",
            "cart",
            "addresses",
            "onboarding",
        ],
        interpolation: { escapeValue: false },
    });

    const isRTL = storedLanguage === 'ar';

    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
}


initI18n();


export default i18n;
