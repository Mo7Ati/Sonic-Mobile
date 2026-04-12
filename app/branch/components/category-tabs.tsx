import { useAppTheme } from "@/hooks/use-app-theme";
import { Category } from "@/services/branch/types";
import { useCallback, useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";

interface CategoryTabsProps {
    categories: Category[];
    activeIndex: number;
    onTabPress: (index: number) => void;
}

export default function CategoryTabs({ categories, activeIndex, onTabPress }: CategoryTabsProps) {
    const { colors } = useAppTheme();
    const listRef = useRef<FlatList<Category>>(null);

    useEffect(() => {
        if (categories.length === 0 || activeIndex >= categories.length) return;
        listRef.current?.scrollToIndex({
            index: activeIndex,
            animated: true,
            viewPosition: 0.5,
        });
    }, [activeIndex, categories.length]);

    const onScrollToIndexFailed = useCallback(
        (info: { index: number }) => {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.5,
                });
            }, 200);
        },
        [],
    );

    const keyExtractor = useCallback((item: Category) => String(item.id), []);

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <FlatList
                ref={listRef}
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.scrollContent}
                extraData={activeIndex}
                initialNumToRender={categories.length}
                onScrollToIndexFailed={onScrollToIndexFailed}
                renderItem={({ item, index }) => {
                    const isActive = index === activeIndex;
                    return (
                        <Pressable
                            onPress={() => onTabPress(index)}
                            style={[
                                styles.tab,
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
                                {item.name}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    tab: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
    },
    activeTabText: {
        fontWeight: "700",
    },
});
