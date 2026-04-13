import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddToCartBar from "./components/add-to-cart-bar";
import AdditionsSection from "./components/additions-section";
import CompactHeader from "./components/compact-header";
import OptionGroupSection from "./components/option-group-section";
import ProductImageHeader from "./components/product-image-header";
import { useProductPage } from "./hooks/use-product-page";

export default function ProductScreen() {
    const { colors } = useAppTheme();
    const { id } = useLocalSearchParams();
    const page = useProductPage(Number(id));
    const { t } = useTranslation(["product", "general"]);

    const onScroll = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            page.handleScroll(e.nativeEvent.contentOffset.y);
        },
        [page.handleScroll],
    );

    if (page.isPending) {
        return (
            <View style={[styles.screen, styles.centered, { backgroundColor: colors.card }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (page.error || !page.product) {
        return (
            <SafeAreaView style={[styles.screen, styles.centered, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
                    {page.error?.message ?? t("general:errors.something_went_wrong")}
                </Text>
            </SafeAreaView>
        );
    }

    const { product } = page;

    return (
        <View style={[styles.screen, { backgroundColor: colors.card }]}>
            <CompactHeader
                productName={product.name}
                visible={page.showCompactHeader}
            />

            <ScrollView
                ref={page.scrollRef}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <ProductImageHeader
                    image={product.image}
                    onLayout={(e) => page.registerImageHeight(e.nativeEvent.layout.height)}
                />

                <View style={styles.content}>
                    <Text style={[styles.productName, { color: colors.foreground }]}>
                        {product.name}
                    </Text>

                    {product.description ? (
                        <Text style={[styles.description, { color: colors.mutedForeground }]}>
                            {product.description}
                        </Text>
                    ) : null}

                    {product.options.map((group) => (
                        <OptionGroupSection
                            key={group.group_id}
                            group={group}
                            selectedItemId={page.selectedOptions[group.group_id]}
                            onSelect={page.selectOption}
                        />
                    ))}

                    <AdditionsSection
                        additions={product.additions}
                        selectedIds={page.selectedAdditions}
                        onToggle={page.toggleAddition}
                    />
                </View>
            </ScrollView>

            <AddToCartBar
                totalPrice={page.totalPrice}
                quantity={page.quantity}
                allOptionsSelected={page.allOptionsSelected}
                onIncrement={page.incrementQuantity}
                onDecrement={page.decrementQuantity}
                onAddToCart={() => {
                    // TODO: integrate with cart context/state
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.tight,
    },
    errorText: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    content: {
        paddingHorizontal: Spacing.gutter,
        paddingTop: Spacing.md,
    },
    productName: {
        fontSize: 22,
        fontWeight: "800",
        textAlign: "left",
    },
    description: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 20,
        marginTop: Spacing.sm,
        textAlign: "left",
    },
});
