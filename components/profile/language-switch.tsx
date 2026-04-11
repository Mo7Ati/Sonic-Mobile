import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, I18nManager, NativeModules, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";


export default function LanguageSwitch() {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const changeLanguage = async (lang: string) => {
        setLoading(true);

        await i18n.changeLanguage(lang);

        await AsyncStorage.setItem('locale', lang);

        I18nManager.allowRTL(lang === 'ar');
        I18nManager.forceRTL(lang === 'ar');
        NativeModules.DevSettings.reload();
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <LoadingModal visible={loading} /> */}
            {
                loading && <ThemedText>{t("loading")}</ThemedText>
            }
            <View style={{ flexDirection: "row" }}><Text>{t("specialized_welcome", { name: "John", age: 20 })}</Text></View>
            <ThemedText>{t("cart_items", { count: 1 })}</ThemedText>
            <Button title="English" onPress={() => changeLanguage("en")} />
            <Button title="Arabic" onPress={() => changeLanguage("ar")} />
        </SafeAreaView>
    );
}