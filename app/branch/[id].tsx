import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BranchPageSkeleton from "./components/branch-page-skeleton";
import CartBottomBar from "./components/cart-bottom-bar";
import CategorySection from "./components/category-section";
import CategoryTabs from "./components/category-tabs";
import CompactHeader from "./components/compact-header";
import HeroHeader from "./components/hero-header";
import StoreInfoCard from "./components/store-info-card";
import { useBranchPage } from "./hooks/use-branch-page";

export default function BranchScreen() {
    const { colors } = useAppTheme();
    const { id } = useLocalSearchParams();
    const page = useBranchPage(Number(id));
    const { t } = useTranslation("general");

    const onScroll = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            page.handleScroll(e.nativeEvent.contentOffset.y);
        },
        [page.handleScroll],
    );

    if (page.isPending) {
        return (
            <View style={[styles.screen, { backgroundColor: colors.card }]}>
                <BranchPageSkeleton />
            </View>
        );
    }

    if (page.error || !page.branch) {
        return (
            <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
                    {page.error?.message ?? t("errors.branch_not_found")}
                </Text>
            </SafeAreaView>
        );
    }

    const { branch, categories } = page;

    return (
        <View style={[styles.screen, { backgroundColor: colors.card }]}>
            <CompactHeader
                storeName={branch.name ?? t("labels.store")}
                showNameRow={page.showCompactHeader}
                showTabs={page.showFloatingTabs}
                categories={categories}
                activeTabIndex={page.activeTabIndex}
                onTabPress={page.handleTabPress}
                onLayout={page.registerCompactHeaderHeight}
            />

            <ScrollView
                ref={page.scrollRef}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <HeroHeader coverImage={branch.cover_image} />

                <View style={{ backgroundColor: colors.card }}>
                    <StoreInfoCard branch={branch} />
                </View>

                {categories.length > 0 && (
                    <View onLayout={(e) => page.registerInlineTabsY(e.nativeEvent.layout.y)}>
                        <CategoryTabs
                            categories={categories}
                            activeIndex={page.activeTabIndex}
                            onTabPress={page.handleTabPress}
                        />
                    </View>
                )}

                <View
                    style={styles.sectionsContainer}
                    onLayout={(e) => page.registerSectionsContainerY(e.nativeEvent.layout.y)}
                >
                    {categories.map((category, index) => {
                        const products = branch.products?.[category.name] ?? [];
                        return (
                            <CategorySection
                                key={category.id}
                                category={category}
                                products={products}
                                isFirst={index === 0}
                                onLayout={(e) =>
                                    page.registerSectionOffset(index, e.nativeEvent.layout.y)
                                }
                            />
                        );
                    })}
                </View>
            </ScrollView>

            {/* <CartBottomBar /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.tight,
    },
    errorText: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: "center",
    },
    sectionsContainer: {
        paddingHorizontal: Spacing.gutter,
        paddingBottom: Spacing.xl,
    },
});
