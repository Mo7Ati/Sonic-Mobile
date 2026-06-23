import { BorderRadius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface UserAvatarProps {
    name?: string | null;
    size?: number;
    style?: ViewStyle;
}

export function UserAvatar({ name, size = 64, style }: UserAvatarProps) {
    const { colors, font } = useAppTheme();
    const initials = getInitials(name);

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: BorderRadius.full,
                    backgroundColor: colors.accent,
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            {initials ? (
                <Text
                    style={{
                        fontSize: size * 0.4,
                        fontFamily: font.semiBold,
                        color: colors.mutedForeground,
                    }}
                >
                    {initials}
                </Text>
            ) : (
                <Ionicons name="person" size={size * 0.55} color={colors.mutedForeground} />
            )}
        </View>
    );
}

function getInitials(name?: string | null) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase();
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth,
    },
});
