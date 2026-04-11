import { useThemeColors } from "@/hooks/use-theme-color";
import { Product } from "@/services/product/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";

const ACTION_COLOR = "#00875a";

interface ProductListItemProps {
    product: Product;
    onPress?: () => void;
}

export default function ProductListItem({ product, onPress }: ProductListItemProps) {
    const colors = useThemeColors();

    const hasComparePrice =
        product.compare_price != null && Number(product.compare_price) !== Number(product.price);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                    {product.name}
                </Text>
                {product.description ? (
                    <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
                        {product.description}
                    </Text>
                ) : null}
                <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: colors.foreground }]}>
                        EGP {Number(product.price).toFixed(2)}
                    </Text>
                    {hasComparePrice ? (
                        <Text style={[styles.comparePrice, { color: colors.mutedForeground }]}>
                            EGP {Number(product.compare_price).toFixed(2)}
                        </Text>
                    ) : null}
                </View>
                <Text style={[styles.customizable, { color: colors.mutedForeground }]}>
                    Customizable
                </Text>
            </View>

            <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                {product.image ? (
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <Ionicons name="fast-food-outline" size={28} color={colors.mutedForeground} />
                )}
                <View style={styles.actionButton}>
                    <Ionicons name="add-outline" size={14} />
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        paddingVertical: 16,
        gap: 12,
    },
    pressed: {
        opacity: 0.85,
    },
    textCol: {
        flex: 1,
        gap: 4,
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
    },
    description: {
        fontSize: 13,
        fontWeight: "400",
        lineHeight: 18,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: "600",
    },
    comparePrice: {
        fontSize: 13,
        fontWeight: "400",
        textDecorationLine: "line-through",
    },
    customizable: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 2,
    },
    imageWrap: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    actionButton: {
        position: "absolute",
        bottom: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: ACTION_COLOR,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
});
