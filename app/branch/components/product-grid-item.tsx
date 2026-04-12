import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Product } from "@/services/product/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";

interface ProductGridItemProps {
    product: Product;
    onPress?: () => void;
}

export default function ProductGridItem({ product, onPress }: ProductGridItemProps) {
    const { colors } = useAppTheme();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
            ]}
        >
            <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                {product.image ? (
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <Ionicons name="fast-food-outline" size={36} color={colors.mutedForeground} />
                )}
                <View
                    style={[
                        styles.actionButton,
                        { backgroundColor: colors.success, shadowColor: colors.shadow },
                    ]}
                >
                    <Ionicons
                        name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                        size={16}
                        color={colors.successForeground}
                    />
                </View>
            </View>

            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={[styles.price, { color: colors.foreground }]}>
                    EGP {Number(product.price).toFixed(2)}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: BorderRadius.xl,
        overflow: "hidden",
        // padding: 5,
    },
    pressed: {
        opacity: 0.85,
    },
    imageWrap: {
        aspectRatio: 1,
        borderRadius: BorderRadius.xl,
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
        bottom: 10,
        end: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    info: {
        paddingVertical: Spacing.sm,
        gap: Spacing.xs,
        paddingHorizontal: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: 'left',
    },
    price: {
        fontSize: 13,
        fontWeight: "500",
        textAlign: 'left',
    },
});
