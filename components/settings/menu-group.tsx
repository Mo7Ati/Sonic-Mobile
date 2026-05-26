import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface MenuItem {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    destructive?: boolean;
}

interface MenuGroupProps {
    title?: string;
    items: MenuItem[];
}

export function MenuGroup({ title, items }: MenuGroupProps) {
    const { colors, font } = useAppTheme();

    return (
        <View style={styles.container}>
            {title && (
                <Text
                    style={[
                        styles.title,
                        { color: colors.foreground, fontFamily: font.bold },
                    ]}
                >
                    {title}
                </Text>
            )}
            <View style={[styles.group, { borderColor: colors.border }]}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const tone = item.destructive ? colors.destructive : colors.foreground;
                    const iconTone = item.destructive ? colors.destructive : colors.primary;
                    return (
                        <Fragment key={item.key}>
                            <Pressable
                                onPress={item.onPress}
                                style={({ pressed }) => [
                                    styles.row,
                                    pressed && { backgroundColor: colors.muted },
                                ]}
                            >
                                <View style={styles.rowLeft}>
                                    <Ionicons name={item.icon} size={22} color={iconTone} />
                                    <Text
                                        style={[
                                            styles.label,
                                            { color: tone, fontFamily: font.medium },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </View>
                                {!item.destructive && (
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={colors.mutedForeground}
                                    />
                                )}
                            </Pressable>
                            {!isLast && (
                                <View
                                    style={[styles.divider, { backgroundColor: colors.border }]}
                                />
                            )}
                        </Fragment>
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
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    group: {
        borderWidth: 1,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.tight,
    },
    label: {
        fontSize: 16,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginStart: Spacing.md + 22 + Spacing.tight,
    },
});
