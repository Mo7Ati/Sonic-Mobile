import { Colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-color";
import { Branch } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";

interface StoreInfoCardProps {
    branch: Branch;
}

export default function StoreInfoCard({ branch }: StoreInfoCardProps) {
    const colors = useThemeColors();

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
                        {branch.name ?? "Store"}
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
                            {branch.delivery_time} mins
                        </Text>
                    </View>
                ) : null}

                {branch.delivery_fee != null ? (
                    <>
                        <Text style={[styles.metaDot, { color: colors.mutedForeground }]}>·</Text>
                        <View style={styles.metaItem}>
                            <Ionicons name="bicycle-outline" size={16} color={colors.mutedForeground} />
                            <Text style={[styles.metaText, { color: colors.foreground }]}>
                                ILS {Number(branch.delivery_fee).toFixed(2)}
                            </Text>
                        </View>
                    </>
                ) : null}

                <Text style={[styles.metaDot, { color: colors.mutedForeground }]}>·</Text>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                        Delivered by store
                    </Text>
                    <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
                </View>
            </View>

            {/* <View style={[styles.proBanner, { backgroundColor: "#F3F0FF" }]}>
                <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>pro</Text>
                </View>
                <Text style={[styles.proText, { color: "#6B21A8" }]}>
                    Get free delivery with pro
                </Text>
                <Pressable>
                    <Text style={[styles.proLink, { color: "#6B21A8" }]}>Try free</Text>
                </Pressable>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: -90,
        marginBottom: 5,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: StyleSheet.hairlineWidth,
    },
    storeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
    },
    categoryLine: {
        fontSize: 13,
        fontWeight: "400",
    },
    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
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
        gap: 8,
        marginTop: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    proBadge: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    proBadgeText: {
        color: "#fff",
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
