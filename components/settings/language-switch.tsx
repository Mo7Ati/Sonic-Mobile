import { useAppTheme } from "@/hooks/use-app-theme";
import { useLanguage } from "@/hooks/use-language";
import type { AppLanguage } from "@/lib/i18n";
import { BorderRadius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import i18n from "@/lib/i18n";

export default function LanguageSwitch() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation("settings");
    const { setLanguage } = useLanguage();

    const options: { value: AppLanguage; label: string }[] = [
        { value: "ar", label: t("settings:language.arabic") },
        { value: "en", label: t("settings:language.english") },
    ];

    const handlePress = (next: AppLanguage) => {
        if (next === i18n.language) return;
        Alert.alert(t("settings:language.title"), t("settings:language.description"), [
            { text: t("settings:language.cancel", { defaultValue: "Cancel" }), style: "cancel" },
            {
                text: t("settings:language.confirm", { defaultValue: "OK" }),
                onPress: () => {
                    setLanguage(next);
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.mutedForeground, fontFamily: font.medium }]}>
                {t("settings:language.title")}
            </Text>
            <View style={[styles.group, { borderColor: colors.border }]}>
                {options.map((option, index) => {
                    const isSelected = option.value === i18n.language;
                    const isLast = index === options.length - 1;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => handlePress(option.value)}
                            style={[
                                styles.row,
                                {
                                    borderBottomColor: colors.border,
                                    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color: colors.foreground,
                                        fontFamily: isSelected ? font.semiBold : font.regular,
                                    },
                                ]}
                            >
                                {option.label}
                            </Text>
                            {isSelected && (
                                <Ionicons name="checkmark" size={20} color={colors.primary} />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.lg,
        gap: Spacing.sm,
    },
    title: {
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    group: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: BorderRadius.lg,
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    label: {
        fontSize: 16,
    },
});
