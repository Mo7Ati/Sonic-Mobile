import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { formatAmount } from "@/lib/utils.";
import { OptionGroup } from "@/services/product/types";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";

interface OptionGroupSectionProps {
    group: OptionGroup;
    selectedItemId: number | undefined;
    onSelect: (groupId: number, itemId: number) => void;
}

export default function OptionGroupSection({
    group,
    selectedItemId,
    onSelect,
}: OptionGroupSectionProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("product");

    return (
        <View style={[styles.container, { borderColor: colors.border }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                    {t("your_choice_from", { name: group.group })}
                </Text>
                <View style={[styles.badge, { backgroundColor: colors.surfaceError }]}>
                    <Text style={[styles.badgeText, { color: colors.destructive }]}>
                        {t("required")}
                    </Text>
                </View>
            </View>

            {group.items.map((item, index) => {
                const isSelected = selectedItemId === item.id;
                const price = Number(item.price);

                return (
                    <Pressable
                        key={item.id}
                        onPress={() => onSelect(group.group_id, item.id)}
                        style={[
                            styles.row,
                            index < group.items.length - 1 && {
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: colors.border,
                            },
                        ]}
                    >
                        <Text style={[styles.itemName, { color: colors.foreground }]}>
                            {item.name}
                        </Text>
                        <View style={styles.rowEnd}>
                            {price > 0 && (
                                <Text style={[styles.price, { color: colors.mutedForeground }]}>
                                    (+{formatAmount(price)})
                                </Text>
                            )}
                            <View
                                style={[
                                    styles.radio,
                                    { borderColor: isSelected ? colors.primary : colors.border },
                                ]}
                            >
                                {isSelected && (
                                    <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />
                                )}
                            </View>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: Spacing.tight,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
        textAlign: "left",
    },
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Spacing.md,
    },
    itemName: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        textAlign: "left",
    },
    rowEnd: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
    },
    price: {
        fontSize: 14,
        fontWeight: "400",
        textAlign: "left",
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    radioFill: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
