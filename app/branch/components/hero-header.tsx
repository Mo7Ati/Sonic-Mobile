import { Spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeroHeaderProps {
    coverImage: string | null;
}

const HERO_HEIGHT = 200;

export default function HeroHeader({ coverImage }: HeroHeaderProps) {
    const { colors } = useAppTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {coverImage ? (
                <Image
                    source={{ uri: coverImage }}
                    style={styles.coverImage}
                    contentFit="cover"
                    transition={300}
                />
            ) : (
                <View style={[styles.coverImage, { backgroundColor: colors.muted }]} />
            )}
            <View style={[styles.overlay, { paddingTop: insets.top + Spacing.sm }]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        styles.iconButton,
                        { backgroundColor: colors.card, shadowColor: colors.shadow },
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={22} color={colors.foreground} />
                </Pressable>

                <View style={styles.rightActions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            { backgroundColor: colors.card, shadowColor: colors.shadow },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons name="heart-outline" size={22} color={colors.foreground} />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            { backgroundColor: colors.card, shadowColor: colors.shadow },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons name="share-outline" size={22} color={colors.foreground} />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            { backgroundColor: colors.card, shadowColor: colors.shadow },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons name="search-outline" size={22} color={colors.foreground} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HERO_HEIGHT,
        overflow: "hidden",
    },
    coverImage: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: Spacing.md,
    },
    rightActions: {
        flexDirection: "row",
        gap: Spacing.sm,
    },
    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    pressed: {
        opacity: 0.7,
    },
});
