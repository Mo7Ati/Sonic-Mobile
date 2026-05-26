import { UserAvatar } from '@/components/settings/user-avatar';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function UserCard() {
    const { colors, font } = useAppTheme();
    const { t } = useTranslation('settings');
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.muted }]}>
                {/* <UserAvatar name={null} size={64} /> */}
                <View style={styles.guestText}>
                    <Text
                        style={[
                            styles.guestTitle,
                            { color: colors.foreground, fontFamily: font.semiBold },
                        ]}
                    >
                        {t('guest.title')}
                    </Text>
                    <Text
                        style={[
                            styles.guestSubtitle,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                    >
                        {t('guest.subtitle')}
                    </Text>
                </View>
                <View style={styles.guestActions}>
                    <Pressable
                        onPress={() => router.push('/(auth)/login')}
                        style={({ pressed }) => [
                            styles.primaryBtn,
                            { backgroundColor: colors.primary },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.primaryBtnText,
                                { color: colors.primaryForeground, fontFamily: font.semiBold },
                            ]}
                        >
                            {t('guest.login')}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push('/(auth)/register')}
                        style={({ pressed }) => [
                            styles.outlineBtn,
                            { borderColor: colors.primary },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.outlineBtnText,
                                { color: colors.primary, fontFamily: font.semiBold },
                            ]}
                        >
                            {t('guest.register')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <Pressable style={styles.container} onPress={() => router.push('/orders')}>
            <UserAvatar name={user.name} size={70} />
            <View style={styles.info}>
                <View style={styles.TextContainer}>
                    <Ionicons name="person-outline" size={16} color={colors.mutedForeground} />
                    <Text
                        style={[styles.name, { color: colors.foreground, fontFamily: font.semiBold }]}
                        numberOfLines={1}
                    >
                        {user.name}
                    </Text>
                </View>
                <View style={styles.TextContainer}>
                    <Ionicons name="mail-outline" size={16} color={colors.mutedForeground} />
                    <Text
                        style={[
                            styles.meta,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                        numberOfLines={1}
                    >
                        {user.email}
                    </Text>

                </View>
                {user.phone_number && (
                    <Text
                        style={[
                            styles.meta,
                            { color: colors.mutedForeground, fontFamily: font.regular },
                        ]}
                        numberOfLines={1}
                    >
                        {user.phone_number}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: Spacing.gutter,
        marginTop: Spacing.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.xl,
        gap: Spacing.md,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.border,
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    TextContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    name: {
        fontSize: 20,
    },
    meta: {
        fontSize: 14,
    },
    guestText: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    guestTitle: {
        fontSize: 18,
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    guestActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignSelf: 'stretch',
    },
    primaryBtn: {
        flex: 1,
        height: 44,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
    },
    primaryBtnText: {
        fontSize: 15,
    },
    outlineBtn: {
        flex: 1,
        height: 44,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
        borderWidth: 1.5,
    },
    outlineBtnText: {
        fontSize: 15,
    },
    pressed: {
        opacity: 0.85,
    },
});
