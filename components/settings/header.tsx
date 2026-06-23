import { StyleSheet, View } from "react-native";




import { Colors, Spacing } from "@/constants/theme";
import { Text } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { NotificationBell } from "../notifications/notification-bell";

export default function Header() {
    const { t } = useTranslation('settings');
    return (
        <View style={headerStyles.settingsHeader}>
            <View style={headerStyles.settingsHeaderContent}>
                <Text style={headerStyles.settingsHeaderTitle}>{t('settings:header.title')}</Text>
                <Text style={headerStyles.settingsHeaderSubtitle}>{t('settings:header.subtitle')}</Text>
            </View>

            <NotificationBell />
        </View>
    )
}


const headerStyles = StyleSheet.create({
    settingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
    },
    settingsHeaderContent: {
        flex: 1,
        gap: Spacing.xs,
        alignItems: 'flex-start',
    },
    settingsHeaderTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.foreground,
    },
    settingsHeaderSubtitle: {
        fontSize: 16,
        color: Colors.mutedForeground,
    },
});