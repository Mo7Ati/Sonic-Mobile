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
import enAddresses from "@/locales/en/addresses.json";
import arAddresses from "@/locales/ar/addresses.json";

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
        addresses: enAddresses,
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
        addresses: arAddresses,
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
        "addresses",
    ],
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
