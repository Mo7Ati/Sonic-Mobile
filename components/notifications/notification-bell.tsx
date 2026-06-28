import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useUnreadCount } from "@/hooks/react-query-hooks/use-notifications";
import { useIsAuthenticated } from "@/stores/session-store";

/**
 * Bell button with an unread badge. Renders nothing for guests, who have no
 * notification feed.
 */
export function NotificationBell() {
    const router = useRouter();
    const isAuthenticated = useIsAuthenticated();
    const { data: count = 0 } = useUnreadCount();

    if (!isAuthenticated) return null;

    return (
        <Pressable
            onPress={() => router.push("/notifications")}
            hitSlop={8}
            style={styles.button}
        >
            <Ionicons name="notifications-outline" size={24} color={Colors.foreground} />
            {count > 0 && (
                <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
                    <Text style={[styles.badgeText, { color: Colors.primaryForeground }]}>
                        {count > 99 ? "99+" : count}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        position: "relative",
        padding: Spacing.xs,
    },
    badge: {
        position: "absolute",
        top: 0,
        end: 0,
        minWidth: 18,
        height: 18,
        borderRadius: BorderRadius.full,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "800",
    },
});
