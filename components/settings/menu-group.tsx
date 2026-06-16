import { FontFamily } from '@/constants/fonts';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
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
    const { colors } = useAppTheme();

    return (
        <View >
            {items.map((item, index) => {
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
                                <Ionicons name={item.icon} size={22} />
                                <Text style={styles.label} >
                                    {item.label}
                                </Text>
                            </View>
                        </Pressable>
                    </Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        padding: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    label: {
        fontSize: 14,
        color: Colors.foreground,
        fontFamily: FontFamily.medium,
    },
});
