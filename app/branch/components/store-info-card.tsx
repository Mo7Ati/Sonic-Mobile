import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Branch } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";

interface StoreInfoCardProps {
    branch: Branch;
}

export default function StoreInfoCard({ branch }: StoreInfoCardProps) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("general");

    const categoryNames = branch.categories?.map((c) => c.name).join(", ");

    return (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Pressable style={styles.storeRow}>
                <View style={[styles.logoWrap, { backgroundColor: colors.muted }]}>
                    {branch.logo ? (
                        <Image
                            source={{ uri: branch.logo }}
                            style={styles.logo}
                            contentFit="cover"
                            transition={200}
                        />
                    ) : (
                        <Ionicons name="storefront-outline" size={28} color={colors.mutedForeground} />
                    )}
                </View>
                <View style={styles.storeTextCol}>
                    <Text style={[styles.storeName, { color: colors.foreground }]}>
                        {branch.name ?? t("labels.store")}
                    </Text>
                    {categoryNames ? (
                        <Text style={[styles.categoryLine, { color: colors.mutedForeground }]} numberOfLines={1}>
                            {categoryNames}
                        </Text>
                    ) : null}
                </View>
                <Ionicons name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.mutedForeground} />
            </Pressable>

            <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
                {branch.delivery_time ? (
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                        <Text style={[styles.metaText, { color: colors.foreground }]}>
                            {t("delivery.time_mins", { time: branch.delivery_time })}
                        </Text>
                    </View>
                ) : null}

                {branch.delivery_fee != null ? (
                    <>
                        <Text style={[styles.metaDot, { color: colors.mutedForeground }]}>·</Text>
                        <View style={styles.metaItem}>
                            <Ionicons name="bicycle-outline" size={16} color={colors.mutedForeground} />
                            <Text style={[styles.metaText, { color: colors.foreground }]}>
                                {t("currency.ils")} {Number(branch.delivery_fee).toFixed(2)}
                            </Text>
                        </View>
                    </>
                ) : null}

                <Text style={[styles.metaDot, { color: colors.mutedForeground }]}>·</Text>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        {t("labels.delivered_by_store")}
                    </Text>
                    <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
                </View>
            </View>

            {/* <View style={[styles.proBanner, { backgroundColor: Colors.promotionalSurface }]}>
                <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>pro</Text>
                </View>
                <Text style={[styles.proText, { color: Colors.promotionalStrong }]}>
                    Get free delivery with pro
                </Text>
                <Pressable>
                    <Text style={[styles.proLink, { color: Colors.promotionalStrong }]}>Try free</Text>
                </Pressable>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: -90,
        marginBottom: 5,
        marginHorizontal: Spacing.md,
        borderRadius: BorderRadius["2xl"],
        padding: Spacing.md,
        borderWidth: StyleSheet.hairlineWidth,
    },
    storeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.tight,
    },
    logoWrap: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    storeTextCol: {
        flex: 1,
        gap: 2,
    },
    storeName: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: 'left',
    },
    categoryLine: {
        fontSize: 13,
        fontWeight: "400",
    },
    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: Spacing.narrow,
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
    },
    metaText: {
        fontSize: 12,
        fontWeight: "500",
    },
    metaDot: {
        fontSize: 12,
        fontWeight: "700",
    },
    proBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
        marginTop: 14,
        paddingVertical: 10,
        paddingHorizontal: Spacing.tight,
        borderRadius: 10,
    },
    proBadge: {
        backgroundColor: Colors.promotional,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.md,
    },
    proBadgeText: {
        color: Colors.promotionalForeground,
        fontSize: 11,
        fontWeight: "800",
    },
    proText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
    },
    proLink: {
        fontSize: 13,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
});
