import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { formatAmount } from "@/lib/utils.";
import { Addition } from "@/services/product/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";

interface AdditionsSectionProps {
    additions: Addition[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
}

export default function AdditionsSection({
    additions,
    selectedIds,
    onToggle,
}: AdditionsSectionProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("product");

    if (additions.length === 0) return null;

    return (
        <View style={[styles.container, { borderColor: colors.border }]}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={[styles.title, { color: colors.foreground }]}>
                        {t("additions_title")}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                        {t("choose_up_to", { count: 10 })}
                    </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.surfaceInfo }]}>
                    <Text style={[styles.badgeText, { color: colors.link }]}>
                        {t("optional")}
                    </Text>
                </View>
            </View>

            {additions.map((addition, index) => {
                const isSelected = selectedIds.has(addition.id);
                const price = Number(addition.price);

                return (
                    <Pressable
                        key={addition.id}
                        onPress={() => onToggle(addition.id)}
                        style={[
                            styles.row,
                            index < additions.length - 1 && {
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: colors.border,
                            },
                        ]}
                    >
                        <Text style={[styles.itemName, { color: colors.foreground }]}>
                            {addition.name}
                        </Text>
                        <View style={styles.rowEnd}>
                            {price > 0 && (
                                <Text style={[styles.price, { color: colors.mutedForeground }]}>
                                    (+{formatAmount(price)})
                                </Text>
                            )}
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        borderColor: isSelected ? colors.primary : colors.border,
                                        backgroundColor: isSelected ? colors.primary : "transparent",
                                    },
                                ]}
                            >
                                {isSelected && (
                                    <Ionicons name="checkmark" size={14} color={colors.card} />
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
        alignItems: "flex-start",
        paddingBottom: Spacing.tight,
    },
    headerText: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "left",
    },
    subtitle: {
        fontSize: 13,
        fontWeight: "400",
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
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
});
