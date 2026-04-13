import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CompactHeaderProps {
    productName: string;
    visible: boolean;
}

export default function CompactHeader({ productName, visible }: CompactHeaderProps) {
    const { colors } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderBottomColor: colors.border,
                    paddingTop: insets.top,
                },
            ]}
        >
            <View style={styles.row}>
                <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                    {productName}
                </Text>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <Ionicons name="close" size={24} color={colors.foreground} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        start: 0,
        end: 0,
        zIndex: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.gutter,
        paddingVertical: Spacing.tight,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        flex: 1,
        marginEnd: Spacing.md,
    },
});
