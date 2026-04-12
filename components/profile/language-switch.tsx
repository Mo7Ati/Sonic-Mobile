import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, I18nManager, NativeModules, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import i18n from "@/lib/i18n";
import { ThemedText } from "../themed-text";

export default function LanguageSwitch() {
    const { t } = useTranslation("profile");
    const [loading, setLoading] = useState(false);

    const changeLanguage = async (lang: string) => {
        setLoading(true);

        await AsyncStorage.setItem("locale", lang);
        await i18n.changeLanguage(lang);

        I18nManager.allowRTL(lang === "ar");
        I18nManager.forceRTL(lang === "ar");
        NativeModules.DevSettings.reload();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <ThemedText>{t("language.loading")}</ThemedText> : null}
            <View style={{ padding: 16, gap: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>{t("language.title")}</Text>
                <Text style={{ fontSize: 15, opacity: 0.8 }}>{t("language.description")}</Text>
                <Button title={t("language.english")} onPress={() => void changeLanguage("en")} />
                <Button title={t("language.arabic")} onPress={() => void changeLanguage("ar")} />
            </View>
        </SafeAreaView>
    );
}
