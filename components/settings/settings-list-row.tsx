import { FontFamily } from '@/constants/fonts';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { I18nManager, Pressable, StyleSheet, Text, View } from 'react-native';

interface SettingsListRowProps {
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    destructive?: boolean;
    showDivider?: boolean;
}

export function SettingsListRow({
    label,
    value,
    onPress,
    showChevron = true,
    destructive = false,
    showDivider = true,
}: SettingsListRowProps) {
    const { colors } = useAppTheme();
    const chevronName = I18nManager.isRTL ? 'chevron-back' : 'chevron-forward';

    return (
        <View>
            <Pressable
                onPress={onPress}
                disabled={!onPress}
                style={({ pressed }) => [
                    styles.row,
                    pressed && onPress && { backgroundColor: colors.muted },
                ]}
            >
                <Text
                    style={[
                        styles.label,
                        { color: destructive ? Colors.destructive : colors.foreground },
                    ]}
                >
                    {label}
                </Text>

                <View style={styles.trailing}>
                    {value ? (
                        <Text style={[styles.value, { color: colors.mutedForeground }]}>
                            {value}
                        </Text>
                    ) : null}
                    {showChevron && onPress ? (
                        <Ionicons
                            name={chevronName}
                            size={18}
                            color={colors.mutedForeground}
                        />
                    ) : null}
                </View>
            </Pressable>

            {showDivider ? (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.md,
        minHeight: 52,
    },
    label: {
        fontSize: 15,
        fontFamily: FontFamily.medium,
        flex: 1,
    },
    trailing: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginStart: Spacing.sm,
    },
    value: {
        fontSize: 14,
        fontFamily: FontFamily.regular,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginStart: Spacing.gutter,
    },
});
