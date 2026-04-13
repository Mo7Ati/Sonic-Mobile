import { BorderRadius, Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";

interface ProductImageHeaderProps {
    image: string | null;
    onLayout?: (e: LayoutChangeEvent) => void;
}

export default function ProductImageHeader({ image, onLayout }: ProductImageHeaderProps) {
    const { colors } = useAppTheme();
    const router = useRouter();

    return (
        <View
            style={[styles.container, { backgroundColor: colors.muted }]}
            onLayout={onLayout}
        >
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <Ionicons name="fast-food-outline" size={64} color={colors.mutedForeground} />
            )}
            <Pressable
                onPress={() => router.back()}
                style={[styles.closeButton, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
                hitSlop={8}
            >
                <Ionicons name="close" size={22} color={colors.foreground} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1.3,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    closeButton: {
        position: "absolute",
        top: Spacing.xl + Spacing.md,
        end: Spacing.md,
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
});
