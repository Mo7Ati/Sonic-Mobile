import { useThemeColors } from "@/hooks/use-theme-color";
import { Category } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";

interface CategoryTabsProps {
    categories: Category[];
    activeIndex: number;
    onTabPress: (index: number) => void;
}

export default function CategoryTabs({ categories, activeIndex, onTabPress }: CategoryTabsProps) {
    const colors = useThemeColors();
    const scrollRef = useRef<ScrollView>(null);
    const tabWidths = useRef<number[]>([]);

    const scrollToTab = useCallback((index: number) => {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += tabWidths.current[i] ?? 80;
        }
        const tabWidth = tabWidths.current[index] ?? 80;
        const centerOffset = offset - 60 + tabWidth / 2;
        scrollRef.current?.scrollTo({ x: Math.max(0, centerOffset), animated: true });
    }, []);

    useEffect(() => {
        scrollToTab(activeIndex);
    }, [activeIndex, scrollToTab]);

    const handlePress = useCallback((index: number) => {
        onTabPress(index);
    }, [onTabPress]);

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Pressable style={styles.menuButton}>
                <Ionicons name="menu-outline" size={22} color={colors.foreground} />
            </Pressable>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <Pressable
                            key={category.id}
                            onPress={() => handlePress(index)}
                            onLayout={(e) => {
                                tabWidths.current[index] = e.nativeEvent.layout.width;
                            }}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab,
                                isActive && { borderBottomColor: colors.foreground },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: isActive ? colors.foreground : colors.mutedForeground },
                                    isActive && styles.activeTabText,
                                ]}
                                numberOfLines={1}
                            >
                                {category.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    scrollContent: {
        alignItems: "center",
        paddingEnd: 16,
    },
    menuButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        // borderRightWidth: StyleSheet.hairlineWidth,
    },
    tab: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
    },
    activeTabText: {
        fontWeight: "700",
    },
});
