import { UserAvatar } from '@/components/settings/user-avatar';
import { FontFamily } from '@/constants/fonts';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function AccountHeader() {
    const { colors } = useAppTheme();
    const { t } = useTranslation('settings');
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const openUserSettings = () => router.push('/user-settings');

    const displayName = isAuthenticated && user
        ? (user.name ?? user.phone_number)
        : t('guest.title');

    return (
        <View style={styles.container}>
            <Pressable
                onPress={openUserSettings}
                style={({ pressed }) => [styles.userInfo, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={displayName}
            >
                <UserAvatar name={isAuthenticated ? user?.name : null} size={44} />
                <Text
                    style={[styles.title, { color: colors.foreground }]}
                    numberOfLines={1}
                >
                    {displayName}
                </Text>
            </Pressable>

            <Pressable
                onPress={openUserSettings}
                hitSlop={8}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={t('user_settings.title')}
            >
                <Ionicons name="settings-outline" size={24} color={colors.foreground} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.sm,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconButton: {
        padding: Spacing.xs,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: FontFamily.semiBold,
    },
    pressed: {
        opacity: 0.7,
    },
});
