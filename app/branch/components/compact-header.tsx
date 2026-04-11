import { useThemeColors } from "@/hooks/use-theme-color";
import { Category } from "@/services/branch/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryTabs from "./category-tabs";

interface CompactHeaderProps {
    storeName: string;
    showNameRow: boolean;
    showTabs: boolean;
    categories: Category[];
    activeTabIndex: number;
    onTabPress: (index: number) => void;
    onLayout?: (height: number) => void;
}

export default function CompactHeader({
    storeName,
    showNameRow,
    showTabs,
    categories,
    activeTabIndex,
    onTabPress,
    onLayout,
}: CompactHeaderProps) {
    const colors = useThemeColors();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    if (!showNameRow && !showTabs) return null;

    return (
        <View
            style={[styles.container, { backgroundColor: colors.card, paddingTop: insets.top }]}
            onLayout={(e) => onLayout?.(e.nativeEvent.layout.height)}
        >
            {showNameRow && (
                <View style={styles.row}>
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                            styles.iconButton,
                            { borderColor: colors.border },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
                    </Pressable>

                    <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
                        {storeName}
                    </Text>

                    <View style={styles.rightActions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.iconButton,
                                { borderColor: colors.border },
                                pressed && styles.pressed,
                            ]}
                        >
                            <Ionicons name="heart-outline" size={22} color={colors.foreground} />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.iconButton,
                                { borderColor: colors.border },
                                pressed && styles.pressed,
                            ]}
                        >
                            <Ionicons name="share-outline" size={22} color={colors.foreground} />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.iconButton,
                                { borderColor: colors.border },
                                pressed && styles.pressed,
                            ]}
                        >
                            <Ionicons name="search-outline" size={22} color={colors.foreground} />
                        </Pressable>
                    </View>
                </View>
            )}

            {showTabs && categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    activeIndex={activeTabIndex}
                    onTabPress={onTabPress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 12,
    },
    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,
    },
    rightActions: {
        flexDirection: "row",
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: "700",
    },
    pressed: {
        opacity: 0.7,
    },
});
